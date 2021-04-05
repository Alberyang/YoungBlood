import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import {connect} from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import {CircularProgress} from '@material-ui/core';

import {updateProject} from '../../../actions/projectAction';

const styles = (theme) => ({
    textfield:{
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width:"100%",
        underline: "none",
    },
    progress: {
        marginTop: theme.spacing(2),
        marginBottom:theme.spacing(2),
    },
    root: {
        width: "100%",
    }
});

class General_Info extends Component{
    constructor(props) {
      super(props);
      this.onChangeDesc = this.onChangeDesc.bind(this);
      this.onChangeName = this.onChangeName.bind(this);
      this.handleGeneralSubmit = this.handleGeneralSubmit.bind(this);
      this.state = {
        name: this.props.project.project.name,
        description: this.props.project.project.description,
      };
    }

    onChangeName = (event) => {
        this.setState({
            name: event.target.value,
        })
    }

    onChangeDesc = (event) => {
        this.setState({
            description: event.target.value,
        })
    }

    //do update call when user request
    handleGeneralSubmit = (event) =>{
        event.preventDefault();
        let formD = {
            "name": this.state.name,
            "description": this.state.description,
        }
        this.props.dispatch(updateProject(formD, this.props.id));
    }

    render(){
        const {classes} = this.props;
        const {error, project, isUpdatingGen} = this.props.project;
        let content;
        if (error) {
            //if data from fetch is erro
            content = <Alert severity="error">{error}</Alert>;
        } else if(isUpdatingGen){
            //if we are updating and data havent arrive
            content = (
                <Grid container justify="center" className={classes.root}>
                    <CircularProgress color="primary" className={classes.progress}/>
                </Grid>
            );
        } else if (!project) {
            //if the project is undefined
            content = (
              <Typography> The retrieve project not found.</Typography>
            );
        } else {
            //render the name and description of the project
            content = (
                <form onSubmit={this.handleGeneralSubmit}>
                    <Typography>
                        Name
                    </Typography>
                    <TextField 
                        value={this.state.name}
                        onChange={this.onChangeName}
                        fullWidth
                        className={classes.textfield}
                        variant="outlined"
                        required
                    />
                    <br/>
                    <Typography>
                        Description
                    </Typography>
                    <TextField 
                        value={this.state.description}
                        onChange={this.onChangeDesc}
                        fullWidth
                        multiline
                        variant="outlined"
                        className={classes.textfield}
                    />
                    <br/>
                    <Button
                        fullWidth
                        type="submit"
                        size="small"
                        variant="contained"
                        color="primary"
                        className={classes.textfield}
                    >
                        Submit
                    </Button>
                </form>
            );
        }
        return(
            <Fragment>

                {/*section name*/}
                <Typography gutterBottom variant="h5" component="h2">
                    General Information
                </Typography>
                <Divider/>

                {/*name + description content*/}
                {content}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state,
});
export default connect(mapStateToProps)(withStyles(styles)(General_Info));