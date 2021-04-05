import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import axios from '../../helpers/axiosConfig';
import {Container} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ViewNav from './ViewNav';
import Gallery from 'react-grid-gallery';
import {fetchViewPhotos} from '../../actions/viewAction';
import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

class ViewImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_user: 'default',
    };
  }

  componentDidMount() {
    const user_id = this.props.match.params.id;
    this.props.dispatch(fetchViewPhotos(1, user_id));

    axios.get(`/view/${user_id}`).then((res) => {
      this.setState({view_user: res.data});
    });
  }

  render() {
    const {classes} = this.props;
    const {error, isFetching, view_photos} = this.props.view;
    let content;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      content = (
        <Grid container justify="center" alignItems="center">
                  <CircularProgress color="primary" />
        </Grid>
      );
    } else if (view_photos.length === 0 || !view_photos) {
      content = <p className="lead">No photos found.</p>;
    } else {
      const photodata = view_photos.map(getPhoto);

      function getPhoto(elem) {
        return {
          src: '/api/image/' + elem.filename,
          thumbnail: '/api/image/' + elem.filename,
          thumbnailWidth: 'auto',
          thumbnailHeight: 250,
          thumbnailCaption: elem.caption,
          caption: elem.caption,
        };
      }

      let photogrid = (
        <div
          style={{
            display: 'block',
            minHeight: '1px',
            width: '100%',
            border: '1px solid #ddd',
            overflow: 'auto',
            fontFamily: 'Nunito, Lato, sans-serif',
            textAlign: 'center',
            background: 'white',
          }}
        >
          <Gallery
            images={photodata}
            enableLightbox={true}
            enableImageSelection={false}
            currentImageWillChange={this.onCurrentImageChange}
          />
        </div>
      );
      content = <div>{photogrid}</div>;
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
            Photos
          </Typography>
        </div>

        <div className={classes.root}>
          <Container>
            <Helmet>
              <title>Microhard &middot; Images </title>
            </Helmet>
            <br />
            <div className={classes.root}>{content}</div>
          </Container>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ViewImage))
);
