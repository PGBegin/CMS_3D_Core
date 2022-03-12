import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'
import { FetchPostApi } from '../General/FetchPostApi'


class State {
    loading: boolean;
    id_file: number;

    str_url_getapi!: string;
    str_url_postapi!: string;

    file_object!: any;
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



class AttachmentFileCreate extends React.Component<any, State> {
    static displayName = AttachmentFileCreate.name;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            //id_file: props.id_file,
            id_file: 0,

            str_url_getapi: props.str_url_getapi,
            str_url_postapi: props.str_url_postapi,

            file_object: undefined,
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

    handleChangeF = (event: any) => {

        let input = event.target;
        
        this.setState({ file_object: input.files[0] });
        //console.log(input.files[0]);
    }

    async handleSubmit(event: any) {

        const token = GetVerificationToken();

        event.preventDefault();

        //-------------------------------------------------
        // Set Data Objects
        //-------------------------------------------------

        const formData = new FormData();
        //formData.append("MAX_FILE_SIZE", MAX_FILE_SIZE);  
        formData.append("name", this.state.name);
        formData.append("format_data", this.state.format_data);
        formData.append("itemlink", this.state.itemlink);
        formData.append("license", this.state.license);
        formData.append("memo", this.state.memo);
        formData.append("formFile", this.state.file_object);


        const param = {
            method: "POST",  // or "PUT",
            headers: {
                "RequestVerificationToken": token
            },
            body: formData
        }


        //-------------------------------------------------
        // サーバへ送信する
        //-------------------------------------------------
        const response = await fetch(this.state.str_url_postapi,
            param
        );

        const ans = await response.json();


        alert(ans[0].updateresult_msg);


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
                                Name
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="name" defaultValue={this.state.name} onChange={this.handleChange} />
                            </dd>
                            <dt className="col-sm-2">
                                DATA TYPE
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="format_data" defaultValue={this.state.format_data} onChange={this.handleChange} />
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

                            <dt className="col-sm-2">
                                File
                            </dt>
                            <dd className="col-sm-10">
                                <input type="file" name="formFile" className="custom-file-input" onChange={this.handleChangeF} />
                            </dd>

                        </dl>
                        <input type="submit" value="Submit" className="btn btn-primary"/>
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
        //const response = await fetch(`/ContentsAttachmentFile/GetAttachmentFileDetails/${this.props.id_file}`);
        //const data = await response.json();
        this.setState({
            loading: false,
         /*   id_file: this.props.id_file,
            name: data.name,
            file_name: data.file_name,
            format_data: data.format_data,
            file_length: data.file_length,
            itemlink: data.itemlink,
            license: data.license,
            memo: data.memo,*/
        });
    }
}



export function FAttachmentFileCreate() {
    //const { id } = useParams();
    return (<AttachmentFileCreate
        //id_file={id} 
        str_url_getapi={"str_url_getapi"} str_url_postapi={"/ContentsAttachmentFile/Create"} />);
}

