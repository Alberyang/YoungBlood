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
docker pull mongodb
```
2. Pull the MongoDB image from the official repository.
```
# Database file storage location
dbpath = /data/db
# Log file storage location
logpath = /data/log/mongod.log
# Use append to write log
logappend = true
# Whether to run as a daemon
# fork = true
# All ips can be accessed during the development stage, and need to be modified to the designated ip to access during the process stage
bind_ip = 0.0.0.0
# Set the port number
port = 27017
# Whether to enable authentication
auth = true
# Set the size of oplog (MB)
loplogSize=2048
# Turn on password authorization
security.authorization=enabled
```
3. Execution of commands.
```
docker run --name mongodb-new -v /home/mongodb/data:/data/db -v /home/mongodb/conf/mongod.conf:/data/configdb/mongod.conf -p 27017:27017 -d mongo --auth
```
4. Check connection and data by using the MongoDBCompass tool.
5. Modify the configuration file in Springboot.
```
spring:
   data:
      mongodb:
         uri: mongodb://<username>:<password>@<server host address>:27017
         database: micro
         authentication-database: admin
```
#### Redis(docker)
Redis is an in-memory data structure store, used as a distributed, in-memory key–value database, cache and message broker, with optional durability. The system will use docker to deploy this service, so please make sure the docker has been installed before installing Redis.
1. Pull the Redis image.
```
docker pull redis
```
2. Modify the configuration file.
```
a. copy the default configuration file and modify it on this basis. The link is ( https://raw.githubusercontent.com/antirez/redis/4.0/redis.conf );
b. create a Redis file directory on the host containing conf and data, and bring in the configuration file;
c. modify “appendonly” to yes to enable Redis persistence;
d. default “daemonize=no” to start Redis in non-backend mode;
e. turn on “protected-mode” yes;
f. default port mapping 6379;
g. change the password after requirepass to a strong password;
```
3. Execution of commands.
```
docker run -p 6379:6379 --name redis-dev -v /home/docker/redis/conf/redis.conf:/etc/redis/redis.conf -v /home/docker/redis/data:/data -d redis redis-server /etc/redis/redis.conf
```
4. Check connection by using the "redisdesktop" administration tool to test if you can connect properly.
5. Modify the configuration file in Springboot.
```
spring:
   redis:
      host: <address>
      port: 6379 <it should be same with corresponding Redis server's port>
      timeout: 20000 <it could be changed according to your project requirement>
      password: <password>
```
6. Enable docker service to restart containers automatically after restart
```
docker update --restart=always <CONTAINER ID>
```

### The original project installation
#### Packages
Once all the prerequisites have been satisfied, we can focus on the two packages: one for the client-side (/client) and another for the server-side (/server). These two packages have its own package.json files that stores their own dependencies.
- **Client packages**: this package is focused on the frontend development. To install the dependencies, make sure to `cd` to the `client` directory before `npm install`. 
- **Backend packages**: this package keeps all its necessary files in the root directory and the `server` directory. To install the necessary dependencies, we can `npm install` them to the root directory. 

#### Package Installation
1. Install Node.js and npm through this link (https://nodejs.org/en/download/) 
2. Open the terminal window, from the root folder 
```
> npm install
> cd client
> npm install
```
3. Copy contents of .env.example and put it in a file called .env in both main folder and client folder
4. Up to this point, this should be sufficient enough to run the local development environment. Open a new terminal and type in the following command.
```
> npm run dev
```

#### Setting up the environmental variables
This `.env` configuration is located in the root directory:
```
NODE_ENV= <development | production>
DATABASE="mongodb+srv://<your account: your password >@cluster0-gbsk9.mongodb.net/micro?retryWrites=true&w=majority"
SECRET= <your JWT secret>
SENDGRID_API_KEY= <your sendgrid api key>
FROM_EMAIL= <email from address>
```
This particular `.env` configuration should be located in the client directory:
```
REACT_APP_API_ENDPOINT = <path to react api endpoint>
API_MIDDLEWARE = <path to api middleware>
```
### The extended project installation
1. Download the "src" file from the source code and modify the configuration file called "application.yml" in the resources folder. Here you could configure the server port, the parameters related to the post hotness mechanism, the database.
```
server:
   port: 8080 # Modify the server port
heatinfo: 
   view_weight: 1 # Configure the weight value of the view count parameter
   review_weight: 4 # Configure the weight value of the comment count parameter
   thumb_weight: 2 # Configure the weight value of the number of likes parameter
   ucb_valueA: 10  # Configure the hotness weight value for new posts 
   ucb_valueB: 15  # The default value is recommended
   return_nums: 10 # Number of posts returned to the front-end in one request
   userId_outtime: 30 # Configure how long each user's browsing history is kept in Redis, in minutes
   snapshot_del_time: 3600000 # Configure the deletion period of the data in the snapshot table, the default is to delete the data before 3 hours, in milliseconds
spring:
   data:
      mongodb:
         uri: mongodb://<username>:<password>@<server host address>:27017
         database: micro
         authentication-database: admin
   redis:
      host: <server address>
      port: 6379
      timeout: 20000
      password: <password>
```
2. Use the Maven package tool to generate a jar package, and run this jar package. Run the command as follows. 
```
nohup java -jar YoungBlood-1.0-SNAPSHOT.jar > log.txt &
```
3. If you want to restart the project, you need to clear the previous project first, run the following command.
```
netstat -nlp|grep 8080
kill -9 <processId>
```
4. Check if the server starts properly by checking the log files in "log.txt"

## Usage
After the project is launched, you can view the project page by entering the home page and start using all the functions by registering your user identity and logging into the project.
```
http://<server-host-address>:<port>
```
Our project demo has been deployed on the Tencent Cloud, so you can view it by using the following website link.
```
http://121.4.57.204:3000/
Test login email: hotmail@com.cn
Test password: By8853072$
```
### Restful API
The original project API can be accessed through this link (https://github.com/Taylorrrr/COMP30022-Microhard).

| Core Functionality | Request Method                         | Param              | ParamType      | HTTP Verb | Purpose                                   |
|--------------------|----------------------------------------|--------------------|----------------|-----------|-------------------------------------------|
| Moments            | /info/{userId}                         | isRefresh          | boolean        | GET       | Get moments with a high heat value        |
| Moments            | /info/detail/{momentId}                |                    |                | GET       | Get one moment by using moment id         |
| Moments            | /info/{userId}                         |                    |                | POST      | Post a new moment with userId             |
| Moments            | /info/{userId}                         |                    |                | DELETE    | Delete a moment by using user id          | 
| Moments-review     | /info/review/{momentId}/{page}/{limit} | page & limit       | String & String| GET       | Get all reviews about the moment          |
| Moments-review     | /info/review/{momentId}/{userId}       |                    |                | POST      | Post a new review to the moment           | 
| Moments-review     | /info/review/{reviewId}                |                    |                | DELETE    | Delete a review according to the review id|
| Moments-share      | /info/share/{userId}                   | contents & momentId| String & String| POST      | Share a moment with userId and content    |
| Moments-like       | /info/like/{userId}/{momentId}         |                    |                | POST      | Like a moment by user                     |
| Moments-like       | /info/dislike/{userId}/{momentId}      |                    |                | POST      | Dislike a moment by user                  |
| Moments-like | /info/likelog/{userId}/{page}/{limit} | page & limit | String & String | GET | Get the moment the user has liked |
| Moments-like | /info/likeornot/{userId}/{momentId} |  |  | GET | Check whether the user likes or not the moment |

### MongoDB Schemas
The original project MongoDB Schemas can be accessed through this link (https://github.com/Taylorrrr/COMP30022-Microhard).
```
User {
   `ID`: User ID;
   `Username`: Name of user;
   `Email`: Email address;
   `Headline`: Short description of user;
   `Image`: Profile picture;
   `Password`: Secure authentication;
   `Lastname`: Lastname of user;
   `Firstname`: Firstname of user;
   `Major`: Major of user;
   `aboutSection`: About Me section;
   `Location`: Where the user is based in at the current time;
   `Website`: (Optional) Website contact;
   `Linkedin`: (Optional) Linkedin contact;
}

Image {
   'fileId': Image ID;
   'user': Ownership of images;
}

Pdf {
   'fileId': Pdf ID;
   'user': Ownership of pdfs;
}

Project {
   'projectId': Project ID;
   'user': Ownership of pdfs;
   'name': Project's name;
   'description': Project's description;
   'status': Project's progress-status (In Progress/Complete/Cancel);
   'show_status': Project's show-status (Public/Private);
   'contributors': List of contributors;
   'skills': List of skills tag that relevant to the project;
   'rating': Number of people give like to the project;
   'process': The process list will describing the project' progression and tasks involved, consist of ProcessId, process's description and tasks list (nodes);
   'nodes': The tasks list belong to certain process, consist of NodeId and description;
   'timeline': The timeline listed down important events of project;
}

Experience {
   'experienceID': Experience ID
   'user': Ownership of experiences
   'start_date': When the experience was started
   'end_date': When the experience was ended
   'position': Users position in the experience
   'company': The company of the experience
   'description': Experience description
   'state': Experience's status (On going/End)
}

Course {
   'user': Ownnership of course
   'code': Course code
   'name': Name of the course
   'description': Course description
   'state': Course's status (Finished/On Going/Planned)
   'grades': Course grade
   'link': Link to course handbook
   'year': Year course taken
   'sem' : Semester course taken
   'score': Rating of course
}

Info {
   'contents': Content of info
   'images': Array of images of the post
   'username': User who posts
   'user': ID of current user
   'thumbs': Number of likes
   'views': Number of views
   'reviews': Number of reviews
}

Info_heat {
   'heat': Level of heat of the post
   'infoId': ID of that info
}

Info_snapshot {
   'info': Object of info
   'oriInfoId': ID of that info object
}

Review {
   'content': Content of review
   'user': owner of the current review
   'infoId': ID of that info
}
```

