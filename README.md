<h1 align="center">YoungBlood</h1>
<p align="center">
    <img src="logo.png" alt="logo" width="200"/>
</p>

This project is to further extend the web-based e-Portfolio system - Microhard developed by students from COMP30022. The Github link is https://github.com/Taylorrrr/COMP30022-Microhard/.

This project mainly aims to optimize existing functions so that users can have a better experience while using them and expand new functions to achieve user's needs further in different scenarios.

The system mainly consists of the front-end, back-end, and database. The backend mainly uses java and NodeJS to build two services respectively, which provide the most important functions of the whole project. The MongoDB database is used as the persistent storage solution, and Redis is also used as the cache database to meet the high availability requirements. The front-end uses react and material UI frameworks, and the front-end is responsible for displaying the interface and calling the API provided by the back-end, as well as the chat service provided by the third-party service. In addition, the entire project uses git and Jenkins to build CICD, automate integration, testing, and deploy the project to the server.

## Install
This tutorial will describe the process of configuring the development environment for this application on your local computer. The project installation is divided into three parts, the first part is the base environment installation, the second part is the original project deployment, and the third part is the extended project deployment. This whole project uses NodeJS, npm, MongoDB Atlas, Java, Docker, etc. Go check them out if you don't have them locally installed.

### Base Environment Installation
#### NodeJS
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
Install Node.js and npm through this link (https://nodejs.org/en/download/)
#### Maven
Maven is a build automation tool used primarily for Java projects.
Install Maven through this link (https://maven.apache.org/)
#### Java SE
JAVA SE provides the java development toolkit, and java runtime environment, etc.    
Install JavaSE through this link (https://www.oracle.com/hk/java/technologies/javase-downloads.html)
#### Docker
Docker is an open platform for developing, shipping, and running applications. 
Install Docker through this link (https://www.docker.com/get-started)
#### MongoDB(docker)
MongoDB is a source-available cross-platform document-oriented database program. The system will use docker to deploy this service, so please make sure the docker has been installed before installing MongoDB.
1. Pull the MongoDB image from the official repository.
```
> docker pull mongodb
```
2. Pull the MongoDB image from the official repository.
```
> # Database file storage location
> dbpath = /data/db
> # Log file storage location
> logpath = /data/log/mongod.log
> # Use append to write log
> logappend = true
> # Whether to run as a daemon
> # fork = true
> # All ips can be accessed during the development stage, and need to be modified to the designated ip to access during the process stage
> bind_ip = 0.0.0.0
> # Set the port number
> port = 27017
> # Whether to enable authentication
> auth = true
> # Set the size of oplog (MB)
> loplogSize=2048
> # Turn on password authorization
> security.authorization=enabled
```
3. Execution of commands.
```
> docker run --name mongodb-new -v /home/mongodb/data:/data/db -v /home/mongodb/conf/mongod.conf:/data/configdb/mongod.conf -p 27017:27017 -d mongo --auth
```
4. Check connection and data by using the MongoDBCompass tool.
5. Modify the configuration file in Springboot.
```
> spring:
  data:
    mongodb:
      uri: mongodb://<username>:<password>@<server host address>:27017
      database: micro
      authentication-database: admin
```
