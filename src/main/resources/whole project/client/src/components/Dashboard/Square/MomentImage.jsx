import React, {createRef} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Gallery from 'react-grid-gallery';

const styles = () => ({
  review_card: {
    marginBottom: '15px',
  },
});

class MomentImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview_images: undefined,
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
        };
        resolve(photodata);
      });
      fr.addEventListener('error', (e) => {
        reject();
      });
      fr.readAsDataURL(file);
    });
  };

  renderCollection = (collection, container) => {
    Promise.all(collection.map(this.generatePreviewData)).then((imgs) =>
      this.setState({
        preview_images: (
          <div style={{marginTop: '10px'}}>
            <Gallery
              images={imgs}
              thumbnailStyle={this.thumbnailStyle}
              rowHeight={150}
              margin={10}
            />
          </div>
        ),
      })
    );
  };

  onChangeFile(e) {
    let fileCollection = [];
    const formData = this.extractFormData('#my-form');
    while (fileCollection.length) {
      fileCollection.pop();
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
      <Card>
        <CardContent>
          <form
            action=""
            className="myForm"
            id="my-form"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
          >
            <input
              name="pictures"
              type="file"
              id="pictures"
              accept="image/*"
              multiple
              onChange={this.onChangeFile}
            />
          </form>
          {this.state.preview_images}
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(MomentImage));
