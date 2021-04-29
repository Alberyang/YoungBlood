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
