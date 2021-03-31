import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PrivateHome from "./PrivateHome";
import Account from "../Account/Account";
import SignIn from "../Account/SignIn";
import ForgotPassword from "../Account/ForgotPassword";
import ResetPassword from "../Account/ResetPassword";
import Experience from "../Dashboard/Experience";

//import Image from '../Dashboard/Image';
//import Project from '../Dashboard/Project/ProjectList';
import Project from "../Dashboard/Project/ProjectList";
import About from "../About/About";
//import Project from '../Dashboard/Project/ProjectList_edit';
import Project_Edit from "../Dashboard/Project/Project_Edit";
import Project_View from "../Dashboard/Project/Project_View";
import Image from "../Dashboard/Photos/Image";
import Documents from "../Dashboard/Document/Documents";
import AddProfileContent from "../Sign Up/AddProfileContent";
import Course from "../Dashboard/Course/Course";
import NoMatch from "../NoMatch";
import View from "../View/view";
import ViewImage from "../View/ViewImage";
import ViewDocument from "../View/ViewDocument";
import ViewExperience from "../View/ViewExperience";
import ViewCourse from "../View/ViewCourse";
import ViewProject from "../View/ViewProject";
import ViewProjectItem from "../View/ViewProjectItem";

// Import Square page
import Square from "../Dashboard/Square/Moment";

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/sign-in" component={SignIn} />
        <Route exact path="/sign-up" component={AddProfileContent} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password/:token" component={ResetPassword} />
        <Route exact path="/view/:id" component={View} />
        <Route exact path="/view/:id/image" component={ViewImage} />
        <Route exact path="/view/:id/document" component={ViewDocument} />
        <Route exact path="/view/:id/course" component={ViewCourse} />
        <Route exact path="/view/:id/experiences" component={ViewExperience} />
        <Route exact path="/view/:id/project" component={ViewProject} />
        <Route
          exact
          path="/view/:id/project/:project_id"
          component={ViewProjectItem}
        />

        <PrivateHome exact path="/" authed={this.props.user} />
        <PrivateRoute
          exact
          path="/experiences"
          component={Experience}
          authed={this.props.user}
        />
        <PrivateRoute
          exact
          path="/project/:id"
          component={Project_Edit}
          authed={this.props.user}
        />
        <PrivateRoute
          exact
          path="/project/view/:id"
          component={Project_View}
          authed={this.props.user}
        />
        <PrivateRoute
          exact
          path="/project"
          component={Project}
          authed={this.props.user}
        />
        <PrivateRoute
          exact
          path="/image"
          component={Image}
          authed={this.props.user}
        />
        <PrivateRoute
          exact
          path="/document"
          component={Documents}
          authed={this.props.user}
        />
        <PrivateRoute
          exact
          path="/account"
          component={Account}
          authed={this.props.user}
        />

        <PrivateRoute
          exact
          path="/course"
          component={Course}
          authed={this.props.user}
        />

        {/* New Code for square */}
        <PrivateRoute
          exact
          path="/square"
          component={Square}
          authed={this.props.user}
        />

        <Route component={NoMatch} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.user.user });
export default connect(mapStateToProps)(Main);
