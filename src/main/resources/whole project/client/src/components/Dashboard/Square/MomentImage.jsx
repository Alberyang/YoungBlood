import React, {createRef} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Gallery from 'react-grid-gallery';
import Button from '@material-ui/core/Button';
import MsgBar from './MessageBar';

class MomentImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview_images: undefined,
      snackbar: undefined,
      selected_index: [],
    };
    this.extractFormData = this.extractFormData.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.imgPreviewImag = createRef();
  }

  extractFormData = function (form) {
    const formData = new FormData(document.querySelector(form));
    let values = {};

    for (var pair of formData.entries()) {
      if (values[pair[0]]) {
        if (!(values[pair[0]] instanceof Array)) {
          values[pair[0]] = new Array(values[pair[0]]);
        }
        values[pair[0]].push(pair[1]);
      } else {
        values[pair[0]] = pair[1];
      }
    }
    return values;
  };

  generatePreviewData = (file) => {
    const fr = new FileReader();
    return new Promise((resolve, reject) => {
      fr.addEventListener('load', (e) => {
        let photodata = {
          src: fr.result,
          thumbnail: fr.result,
          thumbnailWidth: 'auto',
          thumbnailHeight: '100px',
          isSelected: false,
        };
        resolve(photodata);
      });
      fr.addEventListener('error', (e) => {
        reject();
      });
      fr.readAsDataURL(file);
    });
  };

  selectImage = (index, image) => {
    let selected_index = this.state.selected_index;
    if (image.isSelected) {
      let remove_index = selected_index.indexOf(index);
      selected_index.splice(remove_index, 1);
    } else {
      selected_index.push(index);
    }
    image.isSelected = !image.isSelected;
    this.setState({selected_index: selected_index});
  };

  clearSelected = () => {
    if (this.state.selected_index.length === 0) return;
    let fileCollection = this.props.currentFiles;
    fileCollection = fileCollection.filter((item, index) => {
      return this.state.selected_index.indexOf(index) === -1;
    });
    this.props.loadImages(fileCollection);
    this.setState({
      selected_index: [],
    });
    this.renderCollection(fileCollection, this.imgPreviewImag.current);
  };

  clearAll = () => {
    this.props.loadImages([]);
    this.setState({preview_images: undefined});
  };

  renderCollection = (collection, container) => {
    Promise.all(collection.map(this.generatePreviewData)).then((imgs) =>
      this.setState({
        preview_images: (
          <div style={{marginTop: '10px'}}>
            <Gallery
              backdropClosesModal={true}
              images={imgs}
              thumbnailStyle={this.thumbnailStyle}
              onSelectImage={this.selectImage}
              rowHeight={150}
              margin={10}
              enableImageSelection={true}
            />
          </div>
        ),
      })
    );
  };

  onChangeFile(e) {
    let fileCollection = this.props.currentFiles;
    if (e.target.files.length + fileCollection.length > 9) {
      this.setState({
        snackbar: (
          <MsgBar msg="You can upload 9 photos at most!" severity="error" />
        ),
      });
      setTimeout(() => this.setState({snackbar: undefined}), 3 * 1000);
      return;
    }
    Array.from(e.target.files).map((f) => fileCollection.push(f));
    this.props.loadImages(fileCollection);
    this.renderCollection(fileCollection, this.imgPreviewImag.current);
  }

  thumbnailStyle() {
    return {
      border: '1px solid grey',
      height: '148px',
      width: 'auto',
    };
  }

  render() {
    return (
      <>
        <Card>
          <CardContent>
            <form action="" className="myForm" id="my-form">
              Please select images:
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={this.clearSelected}
                style={{marginLeft: '20px', marginRight: '10px'}}
              >
                Clear Selected
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={this.clearAll}
                style={{marginRight: '10px'}}
              >
                Clear All
              </Button>
              <input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={this.onChangeFile}
                style={{
                  display: 'none',
                }}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  size="small"
                >
                  Upload
                </Button>
              </label>
            </form>
            {this.state.preview_images}
          </CardContent>
        </Card>
        {this.state.snackbar}
      </>
    );
  }
}

export default MomentImage;
