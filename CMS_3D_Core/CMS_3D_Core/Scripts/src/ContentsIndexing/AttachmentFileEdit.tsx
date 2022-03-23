import * as React from "react";
import { useState, useEffect } from "react";

import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'


export const AttachmentFileEdit = () => {

    const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsAttachmentFile/GetAttachmentFileDetails/");
    const [str_url_postapi, setStr_url_postapi] = useState("/ContentsAttachmentFile/EditAttachmentFileEdit/");


    const [loading, setLoading] = useState(true);

    //----------------------------------------------------------------------
    const [values, setValues] = useState({

        name: '',
        type_data: '',
        format_data: '',
        file_name: '',
        file_length: 0,
        itemlink: '',
        license: '',
        memo: '',
        isActive: false,
        create_datetime: null,
        latest_update_datetime: null,
        target_article_id: "",
    });





    useEffect(() => {
        const DataLoading = async () => {

            const response = await fetch(`${str_url_getapi}${id}`);
            const data = await response.json();

            setValues({
                name: data.name,
                type_data: data.type_data,
                format_data: data.format_data,
                file_name: data.file_name,
                file_length: data.file_length,
                itemlink: data.itemlink,
                license: data.license,
                memo: data.memo,
                isActive: data.isActive,
                create_datetime: data.create_datetime,
                latest_update_datetime: data.latest_update_datetime,
                target_article_id: data.target_article_id
            });

            setLoading(false);
        };
        DataLoading();
        console.log("called");
    }, []
    );

    function handleInputChange(e: any) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setValues({ ...values, [name]: value });
        console.log(values);
    }

    const handleSubmit = (event: any) => {

        const updObject = {
            id_file: id,
            name: values.name,
            format_data: values.format_data,
            itemlink: values.itemlink,
            license: values.license,
            memo: values.memo,
        };


        const token = GetVerificationToken();

        event.preventDefault();
        const DeleteUpdating = async () => {

            const response = await fetch(str_url_postapi, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updObject)
            });
            const ans = await response.json();
            alert(ans[0].updateresult_msg);
        };

        DeleteUpdating();

    };

    const renderBlock = () => {
        return (
            <div className="row">
                <div className="col-md-3"></div>



                <div className="col-md-6">

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link>


                    <form onSubmit={handleSubmit}>

                        <dl className="row">
                            <dt className="col-sm-2">
                                Image
                            </dt>
                            <dd className="col-sm-12">
                                {id && <img src={`/ContentsAttachmentFile/GetAttachmentFileObject/${id}`} alt="" loading="lazy"></img>}
                            </dd>

                            <dt className="col-sm-2">
                                IF File
                            </dt>
                            <dd className="col-sm-10">
                                {id}
                            </dd>
                            <dt className="col-sm-2">
                                Name
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="name" defaultValue={values.name} onChange={handleInputChange} />
                            </dd>
                            <dt className="col-sm-2">
                                File Name
                            </dt>
                            <dd className="col-sm-10">
                                {values.file_name}
                            </dd>
                            <dt className="col-sm-2">
                                FORMAT DATA
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="format_data" defaultValue={values.format_data} onChange={handleInputChange} />
                            </dd>
                            <dt className="col-sm-2">
                                FileSize[KB]
                            </dt>
                            <dd className="col-sm-10">
                                {values.file_length / 1000}
                            </dd>
                            <dt className="col-sm-2">
                                Item Link
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="itemlink" defaultValue={values.itemlink} onChange={handleInputChange} />
                            </dd>
                            <dt className="col-sm-2">
                                license
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="license" defaultValue={values.license} onChange={handleInputChange} />
                            </dd>
                            <dt className="col-sm-2">
                                memo
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="memo" defaultValue={values.memo} onChange={handleInputChange} />
                            </dd>
                        </dl>
                        <input type="submit" value="Save" className="btn btn-primary" />
                    </form>
                    <hr />

                    <hr />

                    <div>
                        <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link> |
                        <Link to={`/ContentsEdit/AttachmentFileDetails/${id}`}>Details</Link>|
                        <Link to={`/ContentsEdit/AttachmentFileDelete/${id}`}>Delete</Link>
                    </div>
                </div>

            </div>
        );


    };
    return (
        loading
            ? <p><em>Loading...</em></p>
            : renderBlock()

    );
}