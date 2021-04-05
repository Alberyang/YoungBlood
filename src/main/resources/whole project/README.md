<h1 align="center">Microhard</h1>
<p align="center">
    <img src="logo.png" alt="logo" width="200"/>
</p>

Microhard is a COMP30022 capstone project that delivers a solution to the following problem statement:
> The ePortfolio system must be capable of allowing you to submit individual guest lecture reports and end-of subject individual reflections that are requirements in COMP30022, as well as a team report. You will be assigned a client in addition, either a staff member or a group of Masters students studying SWEN90016.

To tackle this problem, we have chosen to build a MERN stack application. The frontend is written in ReactJS / Redux. The backend is written in Node.js and Express. MongoDB Atlas is used to store our documents and files. Our CI/CD pipeline is through Github Actions where unit testing occurs. Finally, after testing is successfuly, the application is deployed to Heroku. 
The React UI framework used was Material-UI, providing a consistent theme and palette to the application. 

## Technical Manual
[Can be accessed through this link](https://github.com/lux9903/COMP30022-Microhard/wiki)
## Installation requirements
### Prerequisites
This tutorial will cover the process of setting up the development environment on your local computer for this application.
#### npm
npm is our chosen package manager for Node.js packages.
#### MongoDB Atlas
MongoDB Atlas is a database service that is fully managed by MongoDB and is a NoSQL database. To learn more about MongoDB Atlas, read more here: (https://www.mongodb.com/cloud/atlas)

### Packages
Once all the prerequisites have been satisfied, we can focus on the two packages: one for the client-side (`/client`) and another for the server-side (`/server`). These two packages have its own `package.json` files that stores their own dependencies.
- **Client packages**: this package is focused on the frontend development. To install the dependencies, make sure to `cd` to the `client` directory before `npm install`. 
- **Backend packages**: this package keeps all its necessary files in the root directory and the `server` directory. To install the necessary dependencies, we can `npm install` them to the root directory. 

### Package Installation
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
### Setting up the environmental variables
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

## Test

Running Mocha tests

```
> npm run test
```

## RESTful routes & HTTP verbs

| CORE FUNCTIONALITY | ACTION  | PATH                | MONGOOSE                     | HTTP VERB | PURPOSE                        |
|--------------------|---------|---------------------|------------------------------|-----------|--------------------------------|
| User               | Read    | /api/user           | User.findById()              | GET       | Get logged in user             |
| User               | Create  | /api/user           | passport.authenticate()      | POST      | Sign up a new user             |
| User               | Create  | /api/user/sign-in   | passport.authenticate()      | POST      | Sign in a user                 |
| User               | Update  | /api/user/          | User.save()                  | PUT       | Edit logged in user            |
| User               | Delete  | /api/user           | User.findByIdAndRemove()     | DELETE    | Delete logged in user          |     | View dashboard                 |
| Image              | Read    | /api/image          | Image.find()                 | GET       | View all existing images       |
| Image              | Read    | /api/image/:filename| Image.findOne()              | GET       | View an existing image         |
| Image              | Create  | /api/image/upload   | Image.save()                 | POST      | Post a new image to server     |
| Image              | Delete  | /api/image/:id      | Image.deleteOne()            | DELETE    | Delete an existing image       |
| PDF                | Read    | /api/pdf            | Pdf.find()                   | GET       | View all existing pdfs         |
| PDF                | Read    | /api/pdf/:filename  | Pdf.findOne()                | GET       | View an existing pdf           |
| PDF                | Create  | /api/pdf/upload     | Pdf.save()                   | POST      | Post a new pdf to server       |  
| PDF                | Delete  | /api/pdf/:id        | Pdf.deleteOne()              | DELETE    | Delete an existing pdf         |
| Project | Read    | /api/project                         | Project.find()     | GET    | View all existing project                   |
| Project | Read    | /api/conditional                     | Project.find()     | POST   | Sort existing project base on condition     |
| Project | Read    | /api/project/view/:id                | Project.findOne()  | GET    | View an existing project                    |
| Project | Create  | /api/project/create                  | Project.save()     | POST   | Create a new project                        |
| Project | Update  | /api/project/update/:id              | Project.findOne()  | POST   | Edit an existing project                    |
| Project | Delete  | /api/project/:idd                    | Project.deleteOne()| DELETE | Delete an existing project                  |
| Project | Create  | /api/project/add_people/:id          | Project.findOne()  | POST   | Add a contributor to an existing project    |
| Project | Delete  | /api/project/remove_people/:id       | Project.findOne()  | POST   | Delete a contributor of an existing project |
| Project | Create  | /api/project/process/:id             | Project.findOne()  | POST   | Add new process in an existing project      |
| Project | Update  | /api/project/process/update/:id      | Project.findOne()  | POST   | Edit a process of an existing project       |
| Project | Delete  | /api/project/process/remove/:id      | Project.findOne()  | POST   | Delete a process in an existing project     |
| Project | Create  | /api/project/process/node/:id        | Project.findOne()  | POST   | Add new task into certain process in an existing project |
| Project | Update  | /api/project/process/node/update/:id | Project.findOne()  | POST   | Edit a task of certain process in an existing project |
| Project | Update  | /api/project/process/node/finish/:id | Project.findOne()  | POST   | Change a task's status of certain process to "finish" |
| Project | Delete  | /api/project/process/node/remove/:id | Project.findOne()  | POST   | Delete task of certain process in an existing project |
| Project | Create  | /api/project/timeline/:id            | Project.findOne()  | POST   | Add new event into timeline of an existing project |
| Project | Update  | /api/project/timeline/update/:id     | Project.findOne()  | POST   | Update an event of timeline of an existing project |
| Project | Delete  | /api/project/timeline/remove/:id     | Project.findOne()  | POST   | Delete an event of timeline of an existing project |
| Experience        | Read    | /api/experience          | Experience.find()                 | GET       | View all existing experiences      |
| Experience        | Read    | /api/experience/:filename| Experience.findOne()              | GET       | View an existing experience        |
| Experience        | Create  | /api/experience/create   | Experience.save()                 | POST      | Post a new experience to server    |
| Experience        | Delete  | /api/experience/:id      | Experience.deleteOne()            | DELETE    | Delete an existing experience      |
| Experience        | Update  | /api/experience/:id      | Experience.deleteOne()            | POST      | Edit an existing experience        |
| Course            | Read    | /api/course              | Course.find()                     | GET       | View all existing courses          |
| Course            | Read    | /api/course/:filename    | Course.findOne()                  | GET       | View an existing course            |
| Course            | Create  | /api/course/create       | Course.save()                     | POST      | Post a new course to server        |
| Course            | Delete  | /api/course/:id          | Course.deleteOne()                | DELETE    | Delete an existing course          |
| Course            | Update  | /api/course/:id          | Course.deleteOne()                | POST      | Edit an existing course            |

## MongoDB schemas

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
```

## List of important files

```
.github
    - workflows
        node.js.yml
client
    - public
    - src
        - actions
        - components
        - helpers
        - img
        - reducers
        index.js
        setupProxy.js
        store.js
        styles.css
    package.json
    .env
server
    - config
        index.js
        passport.js
    - controller
    - models
    - routes
test
    - file
    course.js
    experience.js
    image.js
    project.js
    system_test.js
    user.js  
.env
package.json
README.md
server.js
```
## Components in the client directory

| Account            | Dashboard      | Home                | Navigation       | Sign Up               | View                | About     |
|--------------------|----------------|---------------------|------------------|-----------------------|---------------------|-----------|
| Account.jsx        | /Course        | Functionalities.jsx | Appbar.jsx       | AboutSectionStep.jsx  | view.jsx            | About.jsx |
| ForgotPassword.jsx | /Document      | Hero.jsx            | NoMatch.jsx      | AddProfileContent.jsx | ViewCourse.jsx      |           |
| ResetPassword.jsx  | /Photos        | HomePage.jsx        | PrimaryNav.js    | BasicDetailsStep.jsx  | ViewDocument.jsx    |           |
| SignIn.jsx         | /Profile       |                     | PrivateHome.jsx  | ContactStep.jsx       | ViewExperience.jsx  |           |
|                    | /Project       |                     | PrivateRoute.jsx | Review.jsx            | ViewImage.jsx       |           |
|                    | Experience.jsx |                     |                  |                       | ViewProject.jsx     |           |
|                    |                |                     |                  |                       | ViewProjectItem.jsx |           |

## Files in the Dashboard directory

| Course                | Document                   | Photos                    | Profile                  | Project                    |
|-----------------------|----------------------------|---------------------------|--------------------------|----------------------------|
| Course.jsx            | AddDocument.jsx            | Image.jsx                 | EditAvatar.jsx           | Project_view.jsx           |
|                       | Documents.jsx              | ImageGrid.jsx             | Profile.jsx              | Project_edit.jsx           |
|                       | EditDocument.jsx           |                           |                          | Projectlist.jsx            |
|                       |                            |                           |                          | General.jsx                |
|                       |                            |                           |                          | Status.jsx                 |   
|                       |                            |                           |                          | Contributors.jsx           |  
|                       |                            |                           |                          | Process.jsx                | 
|                       |                            |                           |                          | Timeline.jsx               |      
  


## Controllers, models and routes in the server directory
| Controllers             | Models             | Routes                            |
|-------------------------|--------------------|-----------------------------------|
| courseController.js     | courseModel.js     | courseRouter.js                   |
| experienceController.js | experienceModel.js | experienceRouter.js               |
| fileController.js       |                    | fileRouter.js                     |
| imageController.js      | imageModel.js      | imageRouter.js                    |
| passwordController.js   |                    | authRouter.js                     |
| pdfController.js        | pdfModel.js        | pdfRouter.js                      |
| projectController.js    | projectModel.js    | projectRouter.js                  |
| userController.js       | userModel.js       | avatarRouter.js userController.js |
|                         |                    | viewRouter.js                     |
