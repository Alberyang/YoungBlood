import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import axios from '../../helpers/axiosConfig';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import ViewNav from './ViewNav';
import withStyles from '@material-ui/core/styles/withStyles';
import {fetchViewDocuments} from '../../actions/viewAction';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import {CircularProgress} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

const styles = (theme) => ({
  tableHeader: {
    fontWeight: '700',
  },
  section: {
    height: '120px',
    backgroundColor: '#094183',
  },
  heading: {
    color: '#fff',
    fontSize: '36px',
  },
  noDocs: {
    margin: '15px',
  },
});
class ViewDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_user: 'default',
    };
  }

  componentDidMount() {
    const user_id = this.props.match.params.id;

    axios.get(`/view/${user_id}`).then((res) => {
      this.setState({view_user: res.data});
    });

    this.props.dispatch(fetchViewDocuments(1, user_id));
  }

  render() {
    const classes = this.props;
    const {error, isFetching, view_documents} = this.props.view;

    let content;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (view_documents.length === 0 || !view_documents) {
      content = (
        <Typography className={classes.noDocs}>No documents found.</Typography>
      );
    } else {
      const Pdfs = view_documents.map((ele) => (
        <TableRow>
          <TableCell>{ele.title}</TableCell>
          <TableCell align="right">
            <a href={ele.getFileLink} target="_blank" rel="noopener noreferrer">
              {ele.originalname}
            </a>
          </TableCell>
          <TableCell align="right">{ele.date}</TableCell>
        </TableRow>
      ));
      content = <TableBody>{Pdfs}</TableBody>;
    }
    return (
      <Fragment>
        <ViewNav view_user={this.state.view_user} />
        <div style={{height: '120px', backgroundColor: '#094183'}}>
          <br />
          <br />
          <Typography
            variant="h1"
            align="center"
            style={{color: '#fff', fontSize: '36px'}}
          >
            Personal Documents
          </Typography>
        </div>

        <Helmet>
          <title>Microhard &middot; Personal Documents </title>
        </Helmet>

        <Container>
          <br />
          <br />

          <TableContainer component={Paper}>
            <Table aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>Title</TableCell>
                  <TableCell align="right" className={classes.tableHeader}>
                    Filename
                  </TableCell>
                  <TableCell align="right" className={classes.tableHeader}>
                    Date Uploaded
                  </TableCell>
                </TableRow>
              </TableHead>
              {content}
            </Table>
          </TableContainer>
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ViewDocument))
);
