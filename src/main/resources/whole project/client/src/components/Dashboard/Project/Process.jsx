import React, {Component, Fragment, useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';
import {connect} from 'react-redux';

import {
  createProcess,
  updateProcess,
  deleteProcess,
  createNode,
  updateNode,
  deleteNode,
  finishNode,
} from '../../../actions/projectAction';

// css for function
const useStyles = makeStyles((theme) => ({
  textfield: {
    width: '80%',
    underline: 'none',
  },
  textfield2: {
    width: '73%',
  },
  accordion: {
    width: '81%',
    underline: 'none',
  },
  button: {
    marginTop: theme.spacing(2),
  },
  root: {
    width: '100%',
  },
}));

// ss for class
const styles = (theme) => ({
  textfield: {
    width: '83%',
    underline: 'none',
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  icon: {
    marginTop: theme.spacing(2),
  },
  progress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  root: {
    width: '100%',
  },
  typo: {
    padding: theme.spacing(1),
    align: 'center',
    width: '100%',
  },
});

//render the process list and have a form to add a process
class Process_List extends Component {
  constructor(props) {
    super(props);
    this.onInputAddProcess = this.onInputAddProcess.bind(this);
    this.handleAddProcessSubmit = this.handleAddProcessSubmit.bind(this);
    this.deleteProcess = this.deleteProcess.bind(this);
    this.updateProcess = this.updateProcess.bind(this);
    this.createNode = this.createNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.finishNode = this.finishNode.bind(this);
    this.state = {
      input: '',
      open: false,
    };
  }

  onInputAddProcess = (event) => {
    this.setState({input: event.target.value});
  };

  //do add call for process when user request
  handleAddProcessSubmit = (event) => {
    event.preventDefault();
    this.setState({open: false});
    let formD = {
      process: {
        description: this.state.input,
        processNum:
          this.props.project.project && this.props.project.project.process
            ? this.props.project.project.process.length + 1
            : 0,
        status: true,
      },
    };
    this.props.dispatch(createProcess(formD, this.props.id));
    this.setState({input: ''});
  };

  //do delete call for process when user request
  deleteProcess = (formD) => {
    this.props.dispatch(deleteProcess(formD, this.props.id));
  };

  //do update call for process when user request
  updateProcess = (formD) => {
    this.props.dispatch(updateProcess(formD, this.props.id));
  };

  //do create call for node when user request
  createNode = (formD) => {
    this.props.dispatch(createNode(formD, this.props.id));
  };

  //do update call for node when user request
  updateNode = (formD) => {
    this.props.dispatch(updateNode(formD, this.props.id));
  };

  //do delete call for node when user request
  deleteNode = (formD) => {
    this.props.dispatch(deleteNode(formD, this.props.id));
  };

  //do update state call for node when user request
  finishNode = (formD) => {
    this.props.dispatch(finishNode(formD, this.props.id));
  };

  handleAddProcessCancel = () => {
    this.setState({
      open: false,
      input: '',
    });
  };

  handleAddProcessOpen = () => {
    this.setState({open: true});
  };

  render() {
    const {classes} = this.props;
    const {error, isUpdatingProc, project} = this.props.project;

    let content;
    if (error) {
      //if fetch return error
      content = <Alert severity="error">{error}</Alert>;
    } else if (isUpdatingProc) {
      //if update call havent return
      content = (
        <Grid container justify="center" className={classes.root}>
          <CircularProgress color="primary" className={classes.progress} />
        </Grid>
      );
    } else if (!project || !project.process) {
      //if project or process is undefined
      content = (
        <Typography className={classes.typo}>
          {' '}
          The retrieve project not found.
        </Typography>
      );
    } else if (project.process && project.process.length === 0) {
      //if timeline is empty right now
      content = (
        <Typography className={classes.typo}>
          {' '}
          The process is empty right now.
        </Typography>
      );
    } else {
      //render the process list
      content = project.process.map((proc) => (
        <Process
          key={proc.processNum}
          process={proc}
          id={this.props.id}
          deleteProcess={this.deleteProcess}
          updateProcess={this.updateProcess}
          createNode={this.createNode}
          updateNode={this.updateNode}
          deleteNode={this.deleteNode}
          finishNode={this.finishNode}
        />
      ));
    }

    return (
      <Fragment>
        {/* section name */}
        <Typography gutterBottom variant="h5" component="h2">
          Process
        </Typography>
        <Divider />

        {/* process list */}
        {content}

        {/* adding form */}
        {!this.state.open ? (
          <Button
            onClick={this.handleAddProcessOpen}
            fullWidth
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Add new Process
          </Button>
        ) : (
          <form onSubmit={this.handleAddProcessSubmit}>
            <TextField
              label="Add description for new process"
              onChange={this.onInputAddProcess}
              //InputProps={{ disableUnderline: true }}
              required
              fullWidth
              size="small"
              variant="outlined"
              className={classes.textfield}
            />
            <IconButton type="submit" className={classes.icon}>
              <CheckIcon fontSize="small" color="primary" />
            </IconButton>
            <IconButton
              onClick={this.handleAddProcessCancel}
              className={classes.icon}
            >
              <ClearIcon fontSize="small" style={{color: 'red'}} />
            </IconButton>
          </form>
        )}
      </Fragment>
    );
  }
}

//render a particular process with a form to add a node
function Process(props) {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState(props.process.description);
  const [nodelist, setNodeList] = useState(props.process.nodes);
  const classes = useStyles();

  //re set when re-render happen
  useEffect(() => {
    setDescription(props.process.description);
    setNodeList(props.process.nodes);
  }, [props.process]);

  //function to render all the node in a process
  const renNodeList = () => {
    return (
      nodelist &&
      nodelist.map((node) => {
        return (
          <Node
            key={node.index}
            node={node}
            id={props.id}
            processNum={props.process.processNum}
            createNode={(formD) => props.createNode(formD)}
            updateNode={(formD) => props.updateNode(formD)}
            deleteNode={(formD) => props.deleteNode(formD)}
            finishNode={(formD) => props.finishNode(formD)}
          />
        );
      })
    );
  };

  const handleNodeListOpen = () => {
    setOpen(true);
  };

  const handleNodeListClose = () => {
    setOpen(false);
  };

  const handleAddNodeOpen = () => {
    setOpenAdd(true);
  };

  const handleAddNodeCancel = () => {
    setOpenAdd(false);
    setInput('');
  };

  const onInputAddNodeChange = (event) => {
    setInput(event.target.value);
  };

  //when click add node inside a process
  const handleAddNodeSubmit = (event) => {
    event.preventDefault();
    setOpenAdd(false);
    let formD = {
      processNum: props.process.processNum,
      description: input,
    };
    props.createNode(formD);
  };

  const handleProcessEditOpen = () => {
    setOpenEdit(true);
  };

  const handleProcessEditCancel = () => {
    setOpenEdit(false);
    setDescription(props.process.description);
  };

  const onInputEditProcessChange = (event) => {
    setDescription(event.target.value);
  };

  //when submit editing info for process
  const handleProcessEditSubmit = (event) => {
    event.preventDefault();
    setOpenEdit(false);
    let formD = {
      processNum: props.process.processNum,
      description: description,
    };
    props.updateProcess(formD);
  };

  //when click delete for process
  const handleProcessDelete = () => {
    let formD = {
      processNum: props.process.processNum,
    };
    props.deleteProcess(formD);
  };
  return (
    <Fragment>
      <List className={classes.root}>
        <ListItem>
          {!openEdit ? (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <TextField
                disabled
                value={description}
                //InputProps={{ disableUnderline: true }}
                variant="outlined"
                size="small"
                className={classes.accordion}
              />
              <IconButton onClick={handleProcessEditOpen}>
                <EditIcon fontSize="small" color="primary" />
              </IconButton>
              <IconButton onClick={handleProcessDelete}>
                <DeleteIcon fontSize="small" style={{color: 'red'}} />
              </IconButton>
            </Grid>
          ) : (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <TextField
                onChange={onInputEditProcessChange}
                value={description}
                variant="outlined"
                size="small"
                required
                className={classes.accordion}
              />
              <IconButton onClick={handleProcessEditSubmit}>
                <CheckIcon fontSize="small" color="primary" />
              </IconButton>
              <IconButton onClick={handleProcessEditCancel}>
                <ClearIcon fontSize="small" style={{color: 'red'}} />
              </IconButton>
            </Grid>
          )}
          {!open ? (
            <IconButton onClick={handleNodeListOpen}>
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton onClick={handleNodeListClose}>
              <ExpandLessIcon fontSize="small" />
            </IconButton>
          )}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {renNodeList()}
            <ListItem>
              {!openAdd ? (
                <Button
                  onClick={handleAddNodeOpen}
                  fullWidth
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  Add new task
                </Button>
              ) : (
                <form onSubmit={handleAddNodeSubmit} className={classes.root}>
                  <Grid container direction="row" justify="flex_start">
                    <TextField
                      label="Add new task"
                      onChange={onInputAddNodeChange}
                      required
                      variant="outlined"
                      size="small"
                      className={classes.textfield2}
                    />
                    <IconButton type="submit" className={classes.icon}>
                      <CheckIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={handleAddNodeCancel}
                      className={classes.icon}
                    >
                      <ClearIcon fontSize="small" style={{color: 'red'}} />
                    </IconButton>
                  </Grid>
                </form>
              )}
            </ListItem>
          </List>
        </Collapse>
        <Divider />
      </List>
    </Fragment>
  );
}

//render the node-items, which each have view and edit mode
function Node(props) {
  const [description, setDescription] = useState(props.node.description);
  const [status, setStatus] = useState(props.node.state);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  //re-set data when re-render
  useEffect(() => {
    setDescription(props.node.description);
    setStatus(props.node.state);
  }, [props.node]);

  const handleEditNodeCancel = () => {
    setOpen(false);
    setDescription(props.node.description);
  };

  const handleEditNodeOpen = () => {
    setOpen(true);
  };

  //when click delete for node
  const handleNodeDelete = () => {
    let formD = {
      processNum: props.processNum,
      nodeIndex: props.node.index,
    };
    props.deleteNode(formD);
  };

  const OnInputEditNodeChange = (event) => {
    setDescription(event.target.value);
  };

  //when submit editing data for node
  const handleEditNodeUpdate = (event) => {
    event.preventDefault();
    setOpen(false);
    let formD = {
      processNum: props.processNum,
      nodeIndex: props.node.index,
      description: description,
    };
    props.updateNode(formD);
  };

  //when check state into "finish" for node
  const handleFinishNode = (event) => {
    setStatus(event.target.checked);
    let formD = {
      processNum: props.processNum,
      nodeIndex: props.node.index,
      state: event.target.checked,
    };
    props.finishNode(formD);
  };

  return (
    <Fragment>
      <ListItem>
        {!open ? (
          <Grid container direction="row" justify="flex_start">
            <TextField
              disabled
              value={description}
              multiline
              variant="outlined"
              className={classes.textfield2}
              size="small"
            />
            <Checkbox
              checked={status}
              onChange={handleFinishNode}
              className={classes.icon}
            />
            <IconButton onClick={handleEditNodeOpen} className={classes.icon}>
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
            <IconButton onClick={handleNodeDelete} className={classes.icon}>
              <DeleteIcon fontSize="small" style={{color: 'red'}} />
            </IconButton>
          </Grid>
        ) : (
          <form onSubmit={handleEditNodeUpdate} className={classes.root}>
            <Grid container direction="row" justify="flex_start">
              <TextField
                onChange={OnInputEditNodeChange}
                value={description}
                multiline
                required
                variant="outlined"
                size="small"
                className={classes.textfield2}
              />
              <Checkbox
                checked={status}
                onChange={handleFinishNode}
                className={classes.icon}
              />
              <IconButton type="submit" className={classes.icon}>
                <CheckIcon fontSize="small" color="primary" />
              </IconButton>
              <IconButton
                onClick={handleEditNodeCancel}
                className={classes.icon}
              >
                <ClearIcon fontSize="small" style={{color: 'red'}} />
              </IconButton>
            </Grid>
          </form>
        )}
      </ListItem>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(withStyles(styles)(Process_List));
