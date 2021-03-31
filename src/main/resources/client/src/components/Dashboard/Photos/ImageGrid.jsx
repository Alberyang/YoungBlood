import React, {Component, Fragment} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Gallery from 'react-grid-gallery';
import {fetchPhotos, deletePhoto} from '../../../actions/photoAction';
import {connect} from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import {withRouter} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

class ImageGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      deleteImageLink: null,
      currentImage: 0,
      page: 1,
      delete: false,
      open: false,
    };
    this.deleteImage = this.deleteImage.bind(this);
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  deleteImage(e) {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete image number ${this.state.currentImage}?`
      )
    ) {
      this.props.dispatch(
        deletePhoto(this.props.photo.photos[this.state.currentImage]._id)
      );
      this.setState({delete: true});
    }
  }
  onCurrentImageChange(index) {
    this.setState({currentImage: index});
  }

  componentDidMount() {
    let page = 1;

    if (this.props.match.params.page !== undefined) {
      page = this.props.match.params.page;
    }
    this.props.dispatch(fetchPhotos(page));
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let page = 1;

      if (this.props.match.params.page !== undefined) {
        page = this.props.match.params.page;
      }
      this.props.dispatch(fetchPhotos(page));
    }
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    this.setState({open: false, delete: false});
  };

  render() {
    const {classes} = this.props;
    const {error, isFetching, photos} = this.props.photo;
    console.log(this.props);

    let content;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (photos.length === 0 || !photos) {
      content = <p className="lead">No photos found.</p>;
    } else {
      const photodata = photos.map(getPhoto);

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
            customControls={[
              <button key="deleteImage" onClick={this.deleteImage}>
                Delete Image
              </button>,
            ]}
          />
          {this.state.delete ? (
            <Snackbar open autoHideDuration={4000} onClose={this.handleClose}>
              <Alert
                onClose={this.handleClose}
                severity="success"
                variant="filled"
              >
                Image was successfully deleted!
              </Alert>
            </Snackbar>
          ) : null}
        </div>
      );
      content = <div>{photogrid}</div>;
    }
    return (
      <Fragment>
        <div className={classes.root}>{content}</div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ImageGrid))
);
