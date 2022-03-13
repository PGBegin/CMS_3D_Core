﻿import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'
import { FetchPostApi } from '../General/FetchPostApi'


class State {
    loading: boolean;
    action_state: number;
    action_result_msg!: string;
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
        this.action_state = 0;
        this.id_file = 0;
    }
}



class AttachmentFileDelete extends React.Component<any, State> {
    static displayName = AttachmentFileDelete.name;

    constructor(props: any) {
        super(props);
        this.state = {
            //attachmentfiledata: new AttachmentFileData(), 
            loading: true,
            action_state: 0,
            action_result_msg: "",
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

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link>

                    {this.state.action_state == 1 && <p className="text-info">{this.state.action_result_msg}</p>}

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
                                this.state.name
                            </dd>
                            <dt className="col-sm-2">
                                File Name
                            </dt>
                            <dd className="col-sm-10">
                                this.state.file_name
                            </dd>
                            <dt className="col-sm-2">
                                DATA TYPE
                            </dt>
                            <dd className="col-sm-10">
                                this.state.format_data
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
                                this.state.itemlink
                            </dd>
                            <dt className="col-sm-2">
                                license
                            </dt>
                            <dd className="col-sm-10">
                                this.state.license
                            </dd>
                            <dt className="col-sm-2">
                                memo
                            </dt>
                            <dd className="col-sm-10">
                                this.state.memo
                            </dd>
                        </dl>
                        
                        {this.state.action_state == 0 && <input type="submit" value="Delete" className="btn btn-danger" />}
                    </form>
                    <hr />


                    <hr />

                    <div>
                        <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link> |
                        {this.state.action_state == 0 && <Link to={`/ContentsEdit/AttachmentFileEdit/${this.state.id_file}`}>Edit</Link>}
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
        const response = await fetch(`/ContentsAttachmentFile/GetAttachmentFileDetails/${this.props.id_file}`);
        const data = await response.json();
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


export function FAttachmentFileDelete() {
    const { id } = useParams();
    return (<AttachmentFileDelete id_file={id} />);
}





/*

import { useForm, SubmitHandler } from 'react-hook-form';
import * as React from "react";
import * as ReactDOM from 'react-dom'

type Inputs = {
    example: string;
    exampleRequired: string;
};
export function FAttachmentFilesDelete() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log('onSubmit:', data);
    console.log('watch:', watch('example')); // watchは引数に渡した名前の入力値を監視する
    return (
        // handleSubmitはフォームの入力を確かめたうえで、引数に渡した関数(onSubmit)を呼び出す 
        <form onSubmit={handleSubmit(onSubmit)}>
            {
            // register関数の呼び出しにより、フォーム入力の要素を引数の名前で登録する 
            }
            <input defaultValue="test" {...register('example')} />
            {
            //register関数の第2引数には、HTML標準フォームデータ検証のルールが渡せる 
            }
            <input {...register('exampleRequired', { required: true })} />
            {
            // データ検証に失敗するとerrorsが返され、登録した名前で取り出せる 
            }
            {errors.exampleRequired && (
                <span style={{ color: 'red' }}>This field is required</span>
            )}
            <input type="submit" />
        </form>
    );
}
*/