import * as React from "react";
import * as ReactDOM from 'react-dom';

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken';
import {  ModelViewing } from '../TDOperating/ModelFileView';
import { MeshTest } from "../test/MeshTest";
import { OrbitControlsTest } from "../test/OrbitControlsTest";


class State {
    loading: boolean;
    action_state: number;
    action_result_msg!: string;


    str_url_getapi!: string;
    str_url_postapi!: string;


    id_part: string;
    part_number: string;
    version: number;
    type_data!: string;
    file_name!: string;
    format_data!: string;
    file_length!: number;
    license!: string;
    author!: string;
    itemlink!: string;
    memo!: string;
    create_datetime!: Date;
    latest_update_datetime!: Date;



    constructor() {
        this.loading = false;
        this.action_state = 0;

        this.id_part = "";
        this.part_number = "";
        this.version = 0;
    }
}



class CModelFileDetails extends React.Component<any, State> {
    static displayName = CModelFileDetails.name;
    //mv!: ModelViewing;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            action_state: 0,
            action_result_msg: "",

            str_url_getapi: props.str_url_getapi,
            str_url_postapi: props.str_url_postapi,


            id_part: props.id_part,
            part_number: "",
            version: 0,
            type_data: "",
            file_name: "",
            format_data: "",
            file_length: 0,
            license: "",
            author: "",
            itemlink: "",
            memo: "",
            create_datetime: new Date,
            latest_update_datetime: new Date,


        };
        //this.mv=new ModelViewing();
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
            //name: this.state.name,
            file_name: this.state.file_name,
            format_data: this.state.format_data,
            file_length: 0,
            itemlink: this.state.itemlink,
            license: this.state.license,
            memo: this.state.memo,
        };


        const token = GetVerificationToken();

        //const ans = await FetchPostApi("/ContentsAttachmentFile/EditAttachmentFilesDelete", token, updObject);
        //const x = await ans.json();

        event.preventDefault();
        const response = await fetch("/ContentsAttachmentFile/EditAttachmentFileDelete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)
        });
        const ans = await response.json();


        this.setState({
            action_state: 1,
            action_result_msg: ans[0].updateresult_msg,
        });

        alert(ans[0].updateresult_msg);
    }
    renderTable() {
        return (


            <div className="row">
                <div className="col-md-3"></div>


                <div className="col-md-6">

                    <h4>Model Management</h4>

                    <Link to="/ContentsEdit/ContentsModelFile">Return Index</Link>

                    {this.state.action_state == 1 && <p className="text-info">{this.state.action_result_msg}</p>}


                    <div className="row">
                        <div className="col-md-6">
                            <div id="model_screen">
                                <div className="progress" id="div_progressbar_modeldl">
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            Elementname
                                        </th>
                                        <th>
                                            X
                                        </th>
                                        <th>
                                            Y
                                        </th>
                                        <th>
                                            Z
                                        </th>
                                        <th>
                                            W
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Camera Position
                                        </td>
                                        <td>
                                            <input id="cam_pos_x" name="cam_pos_x" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_pos_y" name="cam_pos_y" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_pos_z" name="cam_pos_z" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Camera Look At
                                        </td>
                                        <td>
                                            <input id="cam_lookat_x" name="cam_lookat_x" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_lookat_y" name="cam_lookat_y" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_lookat_z" name="cam_lookat_z" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Camera Quaternion
                                        </td>
                                        <td>
                                            <input id="cam_quat_x" name="cam_quat_x" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_quat_y" name="cam_quat_y" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_quat_z" name="cam_quat_z" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="cam_quat_w" name="cam_quat_w" type="text" value="" className="form-control" disabled />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Orbit Control Target
                                        </td>
                                        <td>
                                            <input id="obt_target_x" name="obt_target_x" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="obt_target_y" name="obt_target_y" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            <input id="obt_target_z" name="obt_target_z" type="text" value="" className="form-control" disabled />
                                        </td>
                                        <td>
                                            --
                                        </td>
                                    </tr>
                                </tbody>
                            </table>



                        </div>





                    </div>




                    <form onSubmit={this.handleSubmit}>

                        <dl className="row">





                            <dt className="col-sm-2">
                                Part Number
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.part_number}
                            </dd>
                            <dt className="col-sm-2">
                                Version
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.version}
                            </dd>
                            <dt className="col-sm-2">
                                DATA TYPE
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.type_data}
                            </dd>
                            <dt className="col-sm-2">
                                Format
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.format_data}
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
                                <a href={this.state.itemlink} target="_blank" rel="noopener noreferrer">{this.state.itemlink}</a>
                            </dd>
                            <dt className="col-sm-2">
                                License
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.license}
                            </dd>
                            <dt className="col-sm-2">
                                Author
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.author}
                            </dd>
                            <dt className="col-sm-2">
                                Memo
                            </dt>
                            <dd className="col-sm-10">
                                {this.state.memo}
                            </dd>
                        </dl>

                        {this.state.action_state == 0 && <input type="submit" value="Delete" className="btn btn-danger" />}
                    </form>
                    <hr />


                    <hr />

                    <div>
                        <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link> |
                        {this.state.action_state == 0 && <Link to={`/ContentsEdit/AttachmentFileEdit/${this.state.id_part}`}>Edit</Link>}
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
        //        const response = await fetch(`/ContentsAttachmentFile/GetAttachmentFileDetails/${this.props.id_file}`);
        const response = await fetch(`${this.state.str_url_getapi}${this.props.id_part }`);
        const data = await response.json();
        this.setState({
            loading: false,

            part_number: data.part_number,
            version: data.version,
            type_data: data.type_data,

            file_name: data.file_name,
            format_data: data.format_data,
            file_length: data.file_length,
            author: data.author,
            itemlink: data.itemlink,
            license: data.license,
            memo: data.memo,
            create_datetime: data.create_datetime,
            latest_update_datetime: data.latest_update_datetime,
        });
        //this.mv.startup(this.props.id_part);
    }
}



export function ModelFileDetails() {
    const { id } = useParams();
    return (
        <React.StrictMode>

            <MeshTest />
            <OrbitControlsTest />
            
            <CModelFileDetails
                id_part={id}
                str_url_getapi={"/ContentsModelFileApi/GetDetails/"}
                str_url_postapi={"/ContentsAttachmentFile/Create"}
            />


        </React.StrictMode>

    );
}