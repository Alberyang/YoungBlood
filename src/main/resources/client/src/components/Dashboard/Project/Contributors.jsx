import React, { Component, Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import {withStyles } from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import Button from '@material-ui/core/Button';

import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';


import Grid from '@material-ui/core/Grid';

import {
    createContributor,
    deleteContributor,
} from '../../../actions/projectAction';

// css for function
const useStyles = makeStyles((theme) => ({
    textfield:{
        width: "65%",
        underline: "none",
        marginTop: theme.spacing(2),
    },
    icon:{
        marginTop: theme.spacing(2),
    },
    user:{
        underline: "none",
        marginTop: theme.spacing(2),
        width: "100%",
    }
}));

// css for class
const styles = (theme) => ({
    textfield:{
        width: "65%",
        underline: "none",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    button:{
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    icon:{
        marginTop: theme.spacing(2),
    },
    progress: {
        marginTop: theme.spacing(2),
        marginBottom:theme.spacing(2),
    },
    root: {
        width: "100%",
    }
});

//main class
class Con_List extends Component{
    constructor(props){
        super(props);
        this.addContributor = this.addContributor.bind(this);
        this.deleteContributor = this.deleteContributor.bind(this);
        this.onInputContributor = this.onInputContributor.bind(this);
        this.handleContributorSubmit = this.handleContributorSubmit.bind(this);
        this.handleAddCancel = this.handleAddCancel.bind(this);
        this.handleAddClose = this.handleAddClose.bind(this);
        this.handleAddOpen = this.handleAddOpen.bind(this);
        this.state = {
            input: "",
            open: false,
        }
    }

    //do delete one contributor call when user request
    //database called
    deleteContributor = (name) => {
        let formD = {"old_users": name}
        this.props.dispatch(deleteContributor(formD, this.props.id));
    }

    //do add one contributor call when user request
    addContributor = (name) => {
        let formD = {"new_users": name}
        this.props.dispatch(createContributor(formD, this.props.id));
    }

    onInputContributor =(event)=>{
        this.setState({input:event.target.value});
    }

    //add new contributor
    handleContributorSubmit = (event) =>{
        event.preventDefault();
        this.setState({input:"", open:false});
        this.addContributor([this.state.input]);
    }

    handleAddOpen = () => {
        this.setState({open:true});
    }

    handleAddClose = () => {
        this.setState({open:false});
    }

    handleAddCancel = () =>{
        this.setState({
            open:false,
            input: "",
        });
    }

    render(){
        const {classes}= this.props;
        const {error, isUpdatingCon, project} = this.props.project;
        const {user} = this.props.user;

        //console.log(project);
        let content;
        if (error) {
            //if the fetch return error
            content = <Alert severity="error">{error}</Alert>;
        } else if (isUpdatingCon) {
            //if the updating is still yet return
            content = (
                <Grid container justify="center" className={classes.root}>
                    <CircularProgress color="primary" className={classes.progress}/>
                </Grid>
            );
        } else if (!project || !project.contributors) {
            //if project is undefined or the contributor is undefined
            content = (
              <Typography> The retrieve project not found.</Typography>
            );
        } else {
            //render the contributor list
            content = project.contributors.map((cons, i) => (
              <ConItems key={i} cons={cons} add={this.addContributor} delete={this.deleteContributor} username={user.username}/>
            ));
        }

        return(
            <Fragment>

                {/* section name */}
                <Typography gutterBottom variant="h5" component="h2">
                    Contributors
                </Typography>
                <Divider/>

                {/* contributor list */}
                {content}

                {/* adding form */}
                {!this.state.open ? (
                    <Button 
                        onClick={this.handleAddOpen}
                        fullWidth
                        size="small"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >
                        Add new contributor
                    </Button>
                ) :(
                    <form onSubmit={this.handleContributorSubmit}>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <TextField
                                label="Add contributor"
                                onChange={this.onInputContributor}
                                required
                                variant="outlined"
                                size="small"
                                className={classes.textfield}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <IconButton type="submit" className={classes.icon}>
                                <CheckIcon fontSize="small" color="primary"/>
                            </IconButton>
                            <IconButton onClick={this.handleAddCancel} className={classes.icon} >
                                <ClearIcon fontSize="small" style={{ color: "red" }}/>
                            </IconButton>
                        </Grid>
                    </form>
                )}
            </Fragment>
        )
    }
}

//render each contributor
function ConItems(props){
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(props.cons);
    const classes = useStyles();

    //return to old data of the user cancel the editing 
    const handleContributorCancel = () =>{
        setOpen(false);
        setName(props.cons);
    }
    const handleContributorOpen = () =>{
        setOpen(true);
    }

    //this is to re-set the data when list being re-render 
    useEffect(() => {
        setName(props.cons);
    }, [props.cons]);

    //if the user click delete contributor
    const handleContributorDelete = () =>{
        props.delete([props.cons]);
    };

    const onInputContributorUpdate = (event) =>{
        setName(event.target.value);
    }

    //do update on one contributor call when user request
    //if user click submit edit
    const handleContributorUpdate = (event) => {
        event.preventDefault();
        setOpen(false);
        props.add([name]);
        props.delete([props.cons]);
    };
    return(
        <Fragment>
            {/* check if the contributor is the owner user -> do not allow delete or update */}
            {/* then if not open for edit: render with edit button and delete button*/}
            {/* if is open for edit: render with submit button and cancel button  */}
            {(name === props.username) ? (
                <TextField
                    disabled
                    value={name}
                    variant="outlined"
                    size = "small"
                    className={classes.user}
                />
            ) : (
                (!open) ? (
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <TextField
                            disabled
                            value={name}
                            variant="outlined"
                            size = "small"
                            className={classes.textfield}
                        />
                        <IconButton onClick={handleContributorOpen} className={classes.icon}>
                            <EditIcon  fontSize="small" color="primary"/>
                        </IconButton>
                        <IconButton onClick={handleContributorDelete} className={classes.icon}>
                            <DeleteIcon fontSize="small" style={{ color: "red" }}/>
                        </IconButton>
                    </Grid>
                ) : (
                    <form onSubmit={handleContributorUpdate} fullWidth>
                        <TextField
                            onChange={onInputContributorUpdate}
                            value={name}
                            variant="outlined"
                            size="small"
                            required
                            className={classes.textfield}
                        />
                        <IconButton type="submit" className={classes.icon}>
                            <CheckIcon fontSize="small" color="primary" />
                        </IconButton>
                        <IconButton onClick={handleContributorCancel} className={classes.icon}>
                            <ClearIcon fontSize="small" style={{ color: "red" }} />
                        </IconButton>
                    </form>
                )
            )}
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    ...state,
});
export default connect(mapStateToProps)(withStyles(styles)(Con_List));
