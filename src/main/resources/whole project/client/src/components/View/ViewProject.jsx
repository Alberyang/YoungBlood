import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {Helmet} from 'react-helmet';
import axios from '../../helpers/axiosConfig';
//import Alert from '@material-ui/lab/Alert';
//import {CircularProgress} from '@material-ui/core';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import AccordionSummary from '@material-ui/core/AccordionSummary';
import Accordion from '@material-ui/core/Accordion';
import AccordionActions from '@material-ui/core/AccordionActions';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewNav from './ViewNav';
import {fetchViewProjects} from '../../actions/viewAction';
import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';

const styles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: '#094183',
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  ListItem: {
    padding: '0px',
  },
  list: {
    maxHeight: 100,
    overflow: 'auto',
  },
  container: {
    justify_content: 'space-between',
  },
});

function Project(props) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">{props.project.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          <Typography>Description: {props.project.description}</Typography>
          <Typography>Progress: {props.project.status}</Typography>
        </Grid>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          href={`/view/${props.view_user._id}/project/` + props.project._id}
        >
          View
        </Button>
      </AccordionActions>
    </Accordion>
  );
}
class ViewProject extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.update = this.update.bind(this);
    this.pList = this.pList.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.getCondition = this.getCondition.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onShowStatusChange = this.onShowStatusChange.bind(this);
    this.state = {
      projlist: [],
      search: '',
      search_status: '',
      sortBy: '',
      view_user: 'default',
    };
  }

  pList = () => {
    return (
      this.state.projlist &&
      this.state.projlist.map((proj, i) => {
        return <Project project={proj} view_user={this.state.view_user} />;
      })
    );
  };

  getCondition = (user_id) => {
    let formD = {
      name: this.state.input,
      show_status: 'public',
    };

    if (this.state.search_status !== '') {
      formD['status'] = this.state.search_status;
    }

    if (this.state.sortBy !== '') {
      formD['sortBy'] = this.state.sortBy;
    }
    this.props.dispatch(fetchViewProjects(formD,user_id));
  };

  update = () => {
    this.getCondition(this.state.view_user._id);
  };

  componentDidMount = () => {
    const user_id = this.props.match.params.id;
    axios.get(`/view/${user_id}`).then((res) => {
      this.setState({view_user: res.data});
    });
    this.getCondition(user_id);
  };

  onChangeInput = (event) => {
    event.preventDefault();
    this.setState({input: event.target.value});
  };

  onSearch = (event) => {
    if (event.key === 'Enter') {
      this.update();
    }
  };

  onStatusChange = (event, newstatus) => {
    if (newstatus !== null) {
      this.setState({search_status: newstatus}, this.update);
    }
  };

  onSortChange = (event, newsort) => {
    if (newsort !== null) {
      this.setState({sortBy: newsort}, this.update);
    }
  };

  onShowStatusChange = (event, newshow) => {
    if (newshow !== null) {
      this.setState({show_status: newshow}, this.update);
    }
  };

  render() {
    const {error, isFetching, view_projects} = this.props.view;
    let content;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (view_projects.length === 0 || !view_projects) {
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography> No projects found.</Typography>
        </Grid>
      );
    } else {
      content = view_projects.map((proj) => (
        <Project project={proj} view_user={this.state.view_user} />
      ));
    }
    return (
      <Fragment>
        <ViewNav view_user={this.state.view_user} />
        <Helmet>
          <title>Microhard &middot; My projects </title>
        </Helmet>
        <div style={{height: '120px', backgroundColor: '#094183'}}>
          <br />
          <br />
          <Typography
            variant="h1"
            align="center"
            style={{color: '#fff', fontSize: '36px'}}
          >
            Project Lists
          </Typography>
        </div>
        <br />
        <Container maxWidth="md">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <TextField
              onChange={this.onChangeInput}
              onKeyDown={this.onSearch}
              value={this.state.input}
              variant="outlined"
              size="small"
              placeholder="Search name"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup
              value={this.state.sortBy}
              exclusive
              onChange={this.onSortChange}
              size="small"
            >
              <ToggleButton value="">All</ToggleButton>
              <ToggleButton value="descending">Oldest</ToggleButton>
              <ToggleButton value="ascending">Lastest</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={this.state.search_status}
              exclusive
              onChange={this.onStatusChange}
              size="small"
            >
              <ToggleButton value="">All</ToggleButton>
              <ToggleButton value="Inprogress">In Progress</ToggleButton>
              <ToggleButton value="Completed">Complete</ToggleButton>
              <ToggleButton value="Cancel">Cancel</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <br />
          {content}
          <br />
          <br />
        </Container>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(ViewProject));
