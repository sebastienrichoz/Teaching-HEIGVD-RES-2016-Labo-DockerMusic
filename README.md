# Teaching-HEIGVD-RES-2016-Labo-DockerMusic

## Docker
To run the images, first build them, then run a container from the builded images.

### Build images
To build the images locally, browse in appropriate folder and the type the following command
* In image-musician/ folder type : `docker build -t res/musician .` (Don't forget the dot)
* In image-auditor/ folder type : `docker build -t res/auditor .` (Don't forget the dot)

### Run container
To run the images, type the followinf commands
* Run a musician : `docker run res/musician INSTRUMENT` (INSTRUMENT = piano | flute | violin | drum | trumpet)
* Run an auditor : `docker run res/auditor`


## Admin

* You can work in teams of two students.
* You should fork and clone this repo. You should also configure an `upstream` repo, to be able to pull updates that we will publish in this original repo.
* There will not be a "full" lab grade for this long lab. However, there will *at least* one point to gain for the "salami" TE grade. Also, the skills that you will learn during this lab will be necessary for subsequent labs.
* We expect that you will have more issues and questions than with other labs (because we have a left some questions open on purpose). Please ask your questions on telegram or in the forum, so that everyone in the class can benefit from the discussion.
 
## Objectives

This lab has 4 objectives:

* The first objective is to **design and implement a simple application protocol on top of UDP**. It will be very similar to the protocol presented during the lecture (where thermometers were publishing temperature events in a multicast group and where a station was listening for these events).

* The second objective is to get familiar with several tools from **the JavaScript ecosystem**. You will implement two simple **Node.js** applications. You will also have to search for and use a couple of **npm modules** (i.e. third-party libraries).

* The third objective is to get familiar with **Docker**. You will have to create 2 Docker images (they will be very similar to the images presented in the previous lecture). You will then have to run multiple containers based on these images.

* Last but not least, the fourth objective is to **work with a bit less upfront guidance**, as compared with previous labs. This time, we do not provide a complete webcast to get you started, because we want you to search for information (this is a very important skill that we will increasingly train). Don't worry, we have prepared a fairly detailed list of tasks that will put you on the right track. If you feel a bit overwhelmed at the beginning, make sure to read this document carefully and to find answers to the questions asked in the tables. You will see that the whole thing will become more and more approachable.


## Requirements

In this lab, you will **write 2 small NodeJS applications** and **package them in Docker images**:

* the first app, **Musician**, simulates someone who plays an instrument in an orchestra. When the app is started, it is assigned an instrument (piano, flute, etc.). As long as it is running, every second it will emit a sound (well... simulate the emission of a sound: we are talking about a communication protocol). Of course, the sound depends on the instrument.

* the second app, **Auditor**, simulates someone who listens to the orchestra. This application has two responsibilities. Firstly, it must listen to Musicians and keep track of **active** musicians. A musician is active if it has played a sound during the last 5 seconds. Secondly, it must make this information available to you. Concretely, this means that it should implement a very simple TCP-based protocol.

![image](images/joke.jpg)


### Instruments and sounds

The following table gives you the mapping between instruments and sounds. Please **use exactly the same string values** in your code, so that validation procedures can work.

| Instrument | Sound         |
|------------|---------------|
| `piano`    | `ti-ta-ti`    |
| `trumpet`  | `pouet`       |
| `flute`    | `trulu`       |
| `violin`   | `gzi-gzi`     |
| `drum`     | `boum-boum`   |

### TCP-based protocol to be implemented by the Auditor application

* The auditor should include a TCP server and accept connection requests on port 2205.
* After accepting a connection request, the auditor should send a JSON payload containing the list of active musicians, with the following format (it can be a single line, without indentation):

```
[
  {
  	"uuid" : "aa7d8cb3-a15f-4f06-a0eb-b8feb6244a60",
  	"instrument" : "piano",
  	"activeSince" : "2016-04-27T05:20:50.731Z"
  },
  {
  	"uuid" : "06dbcbeb-c4c8-49ed-ac2a-cd8716cbf2d3",
  	"instrument" : "flute",
  	"activeSince" : "2016-04-27T05:39:03.211Z"
  }
]
```

### What you should be able to do at the end of the lab


You should be able to start an **Auditor** container with the following command:

```
$ docker run -d -p 2205:2205 res/auditor
```

You should be able to connect to your **Auditor** container over TCP and see that there is no active musician.

```
$ telnet IP_ADDRESS_THAT_DEPENDS_ON_YOUR_SETUP 2205
[]
```

You should then be able to start a first **Musician** container with the following command:

```
$ docker run -d res/musician piano
```

After this, you should be able to verify two points. Firstly, if you connect to the TCP interface of your **Auditor** container, you should see that there is now one active musician (you should receive a JSON array with a single element). Secondly, you should be able to use `tcpdump` to monitor the UDP datagrams generated by the **Musician** container.

You should then be able to kill the **Musician** container, wait 10 seconds and connect to the TCP interface of the **Auditor** container. You should see that there is now no active musician (empty array).

You should then be able to start several **Musician** containers with the following commands:

```
$ docker run -d res/musician piano
$ docker run -d res/musician flute
$ docker run -d res/musician flute
$ docker run -d res/musician drum
```
When you connect to the TCP interface of the **Auditor**, you should receive an array of musicians that corresponds to your commands. You should also use `tcpdump` to monitor the UDP trafic in your system.


## Task 1: design the application architecture and protocols

| #  | Topic |
| --- | --- |
|Question | How can we represent the system in an **architecture diagram**, which gives information both about the Docker containers, the communication protocols and the commands? |
| | *Insert your diagram here...* |
|Question | Who is going to **send UDP datagrams** and **when**? |
| | *The Musician and every second* |
|Question | Who is going to **listen for UDP datagrams** and what should happen when a datagram is received? |
| | *The Auditor and he's going to keep a track of active musicians.* |
|Question | What **payload** should we put in the UDP datagrams? |
| | *uuid, instrument, and timestamp to keep track of activity* |
|Question | What **data structures** do we need in the UDP sender and receiver? When will we update these data structures? When will we query these data structures? |
| | *We need a Map for UDP sender with the instrument as key and sound played as value, and for the receiver, this same map but with the sound as key and intrument as value* |


## Task 2: implement a "musician" Node.js application

| #  | Topic
| ---  | ---
|Question | In a JavaScript program, if we have an object, how can we **serialize it in JSON**?
| | *JSON.stringify()*
|Question | What is **npm**?
| | *it's a node.js package manager which provides multiple short libraries*
|Question | What is the `npm install` command and what is the purpose of the `--save` flag?
| | *It's for installing a package (a library) needed for our Node.js app. --save is for having the package appearing in dependecies*
|Question | How can we use the `https://www.npmjs.com/` web site?
| | *By entering a package name in the serach field and then watching an example to know how to use it*
|Question | In JavaScript, how can we **generate a UUID** compliant with RFC4122?
| | *npm install uuid; var uuid = require('uuid'); uuid.v4();*
|Question | In Node.js, how can we execute a function on a **periodic** basis?
| | *By using the standard setInterval javascript method*
|Question | In Node.js, how can we **emit UDP datagrams**?
| | *By using dgram module*
|Question | In Node.js, how can we **access the command line arguments**?
| | *With the keyword 'process'*


## Task 3: package the "musician" app in a Docker image

| #  | Topic
| ---  | ---
|Question | How do we **define and build our own Docker image**?
| | *We define the image in a Dockerfile file and build it with the following command : 'docker build' or within the docker hub web interface*
|Question | How can we use the `ENTRYPOINT` statement in our Dockerfile?
| | *Enter your response here...*
|Question | After building our Docker image, how do we use it to **run containers**?
| | *with the command : docker run [name_of_image] [name_of_instrument]*
|Question | How do we get the list of all **running containers**?
| | *docker ps*
|Question | How do we **stop/kill** one running container?
| | *docker stop running_container_name*
|Question | How can we check that our running containers are effectively sending UDP datagrams?
| | *sudo tcpdump -i docker0 udp port 2205 -X*


## Task 4: implement an "auditor" Node.js application

| #  | Topic
| ---  | ---
|Question | With Node.js, how can we listen for UDP datagrams in a multicast group?
| | *We create a datagram socket with Node.js' udp4 module*
|Question | How can we use the `Map` built-in object introduced in ECMAScript 6 to implement a **dictionary**? 
| | *We simply add the instrument and sounds as key-values in the map. The key is the instrument, and the value is the sound. We get the key by specifying the value*
|Question | How can we use the `Moment.js` npm module to help us with **date manipulations** and formatting? 
| | *Firstly we add it by typing npm install moment, then we declare var moment = require('moment') and finally we follow the string format to convert timestamp date format into the desired date format*
|Question | When and how do we **get rid of inactive players**? 
| | *We get rid of them when they haven't been playing for the last 5 seconds.*
|Question | How do I implement a **simple TCP server** in Node.js? 
| | *With the net module of Node.js*


## Task 5: package the "auditor" app in a Docker image

| #  | Topic
| ---  | ---
|Question | How do we validate that the whole system works, once we have built our Docker image?
| | *By executing the validate.sh script*


## Constraints

Please be careful to adhere to the specifications in this document, and in particular

* the Docker image names
* the names of instruments and their sounds
* the TCP PORT number

Also, we have prepared two directories, where you should place your two `Dockerfile` with their dependent files.

Have a look at the `validate.sh` script located in the top-level directory. This script automates part of the validation process for your implementation (it will gradually be expanded with additional operations and assertions). As soon as you start creating your Docker images (i.e. creating your Dockerfiles), you should try to run it.


## Schedule

| Date | AM/PM | Activity
| :--: | :---: | --------
|27.04.2016 | AM | Orientation and requirements; activity 1.
|27.04.2016 | PM | Activity 2
|04.05.2016 | AM | We will ask some students to **do a demo** of what they have achieved so far. You should be ready to start a Musician Docker container and prove that UDP datagrams are emitted. We will also have a **guest speaker** during the morning session.
|04.05.2016 | PM | Activities 3 and 4
|11.05.2016 | AM | There will be a **written test** on everything that we have studied so far (travail écrit).
|11.05.2016 | PM | Validation and demonstrations.

