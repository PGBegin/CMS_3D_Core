import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'
import { FetchPostApi } from '../General/FetchPostApi'


class State {
    loading: boolean;
    //attachmentfiledata!: AttachmentFileData;
    id_file: number;
    name!: string;
    file_name!: string;
    format_data!: string;
    file_length!: number;
    itemlink!: string;
    license!: string;
    memo!: string;
    constructor() {
        this.loading = false;
        this.id_file = 0;
    }
}



class AttachmentFileEdit extends React.Component<any, State> {
    static displayName = AttachmentFileEdit.name;

    constructor(props: any) {
        super(props);
        this.state = {
            //attachmentfiledata: new AttachmentFileData(), 
            loading: true,
            id_file: props.id_file,
            name: "",
            file_name: "",
            format_data: "",
            file_length: 0,
            itemlink: "",
            license: "",
            memo: "",
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.populateWeatherData();
    }
    
    handleChange = (event: any) => {
        // @ts-ignore
        this.setState({ [event.target.name]: event.target.value });
    }
    async handleSubmit(event: any) {


        const updObject = {
            id_file: this.props.id_file,
            name: this.state.name,
            file_name: this.state.file_name,
            format_data: this.state.format_data,
            file_length: 0,
            itemlink: this.state.itemlink,
            license: this.state.license,
            memo: this.state.memo,
        };


        const token = GetVerificationToken();

        event.preventDefault();
        const ans = await FetchPostApi("/ContentsAttachmentFile/EditAttachmentFileEdit", token, updObject)

        alert('submitted: ' );
        event.preventDefault();
    }
    renderTable() {
        return (


            <div className="row">
                <div className="col-md-3"></div>


                <div className="col-md-6">

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link>


                    <form onSubmit={this.handleSubmit}>

                        <dl className="row">
                            <dt className="col-sm-2">
                                Image
                            </dt>
                            <dd className="col-sm-12">
                                {this.state.id_file && <img src={`/ContentsEditAttachment/GetAttachmentFile/${this.state.id_file}`} alt="" loading="lazy"></img>}
                            </dd>

                            <dt className="col-sm-2">
                                IF File
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.id_file}
                            </dd>
                            <dt className="col-sm-2">
                                Name
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="name" defaultValue={this.state.name} onChange={this.handleChange} />
                            </dd>
                            <dt className="col-sm-2">
                                File Name
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="file_name" defaultValue={this.state.file_name} onChange={this.handleChange} />
                            </dd>
                            <dt className="col-sm-2">
                                DATA TYPE
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="format_data" defaultValue={this.state.format_data} onChange={this.handleChange} />
                            </dd>
                            <dt className="col-sm-2">
                                FileSize[KB]
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.file_length / 1000}
                            </dd>
                            <dt className="col-sm-2">
                                Item Link
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="itemlink" defaultValue={this.state.itemlink} onChange={this.handleChange} />
                            </dd>
                            <dt className="col-sm-2">
                                license
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="license" defaultValue={this.state.license} onChange={this.handleChange} />
                            </dd>
                            <dt className="col-sm-2">
                                memo
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="memo" defaultValue={this.state.memo} onChange={this.handleChange} />
                            </dd>
                        </dl>
                        <input type="submit" value="Submit" />
                    </form>
                    <hr />


                    <hr />

                    <div>
                        <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link> |
                        <a href={`/ContentsEditAttachment/Edit/${this.state.id_file}`}>Edit</a> |
                        <a href={`/ContentsEditAttachment/Delete/${this.state.id_file}`}>Delete</a>
                    </div>
                </div>

            </div>
        );
    }

    render() {
        //const { id } = useParams();
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTable();

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch(`/ContentsAttachmentFile/GetAttachmentFileDetails/${this.props.id_file}`);
        const data = await response.json();
        //this.setState({ attachmentfiledata: data, loading: false, id_file: this.props.id_file });
        this.setState({
            loading: false,
            id_file: this.props.id_file,
            name: data.name,
            file_name: data.file_name,
            format_data: data.format_data,
            file_length: data.file_length,
            itemlink: data.itemlink,
            license: data.license,
            memo: data.memo,
        });
    }
}



export function FAttachmentFileEdit() {
    const { id } = useParams();
    return (<AttachmentFileEdit id_file={id} />);
}

