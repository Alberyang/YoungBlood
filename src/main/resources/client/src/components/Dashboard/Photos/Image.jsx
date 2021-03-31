import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Container} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import ImageGrid from './ImageGrid';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {postPhoto} from '../../../actions/photoAction';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

// Photo page that contains upload button to upload and preview images in grid
class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      create: false,
      open: false,
      caption: '',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.canBeSubmitted = this.canBeSubmitted.bind(this);
    this.getCaption = this.getCaption.bind(this);
  }

  canBeSubmitted() {
    return this.state.caption === '';
  }

  getCaption(e) {
    this.setState({caption: e.target.value});
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append('file', this.state.file);
    var base = `/image/upload/`;
    var url = '';
    if (document.getElementById('caption').value.trim() !== '') {
      url = base + document.getElementById('caption').value;
    } else {
      url = base + 'UNKNOWN_PHOTO';
    }
    this.props.dispatch(postPhoto(url, formData));
  }

  onChange(e) {
    this.setState({file: e.target.files[0]});
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({open: false, create: false});
  };

  render() {
    const isEnabled = this.canBeSubmitted();
    const {classes} = this.props;
    return (
      <Fragment>
        <div style={{height: '120px', backgroundColor: '#094183'}}>
          <br />
          <br />
          <Typography variant="h1" align="center" style={{color: '#fff'}}>
            Photos
          </Typography>
        </div>

        <div className={classes.root}>
          <Container>
            <Helmet>
              <title>Microhard &middot; Photos</title>
            </Helmet>

            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              alignContent="center"
            >
              <Grid item xs={12} sm={12} md={12}>
                <div style={{padding: '20px'}}>
                  <form onSubmit={this.onFormSubmit}>
                    <TextField
                      name="caption"
                      margin="dense"
                      id="caption"
                      label="Image caption"
                      fullWidth
                      variant="filled"
                      autoComplete="off"
                      required
                      value={this.state.caption}
                      onChange={this.getCaption}
                    />
                    <Input
                      type="file"
                      name="file"
                      inputProps={{accept: 'image/*'}}
                      onChange={this.onChange}
                      color="primary"
                    />
                    {this.state.create ? (
                      <Snackbar
                        open
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                      >
                        <Alert
                          onClose={this.handleClose}
                          severity="success"
                          variant="filled"
                        >
                          Image was successfully uploaded!
                        </Alert>
                      </Snackbar>
                    ) : null}
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      onClick={() => this.setState({create: true, open: true})}
                      disabled={isEnabled}
                      style={{float: 'right'}}
                    >
                      Upload
                    </Button>
                  </form>
                </div>
              </Grid>
              <br />
            </Grid>
            <ImageGrid />
          </Container>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(Image));
