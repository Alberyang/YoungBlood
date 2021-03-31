import React, { Component } from 'react'; 
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import logo from '../../img/form-logo.PNG';

import ReactDOM from 'react-dom';
//import axios from 'axios';
import axios from '../../helpers/axiosConfig';

export default class FilesUploadComponent extends Component {
    constructor(props) {
        super(props);
        this.state ={
            file: null
        };
        this.ondelete = this.ondelete.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormSubmitPDF = this.onFormSubmitPDF.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('file',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/image/upload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
    }
    onFormSubmitPDF(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('file',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/pdf/upload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
    }
    ondelete(e){
    	e.preventDefault();
    	const formData = new FormData();
    	const config = {
    		headers: {
                'content-type': 'multipart/form-data'
            }
    	};
    	axios.delete('/pdf/5f57882947ad6155d8f36837').then((response) =>{
    		alert("deleted");
    	}).catch((error) => {
        });
    }

    componentDidMount() {
        const imgs = axios.get("/image").then(res=>{
            if(res.data.files){
                const imgPic = res.data.files.map((ele) =>
                    <img src = {"/api/image/"+ele.filename} alt = {"/image/"+ele.filename}/>
                );
                ReactDOM.render(imgPic,document.getElementById('all_img'));
            }
        })
    }




    render() {
        return (
            <div className="container">
                <div className="row">
                <div>
                    <h3>React File Upload</h3>
                </div>
                <div>
                    <form onSubmit={this.onFormSubmit}>
                        <input type="file" name="file" onChange= {this.onChange} />
                        <button type="submit">Upload</button>
                    </form>

                    <form onSubmit={this.onFormSubmitPDF}>
                        <input type="file" name="file" onChange= {this.onChange} />
                        <button type="submit">Upload</button>
                    </form>
                </div>
                <div id="all_img">
                </div>
                <button onClick = {this.ondelete}> test Delete</button>
                </div>
            </div>
        )
    }
}
