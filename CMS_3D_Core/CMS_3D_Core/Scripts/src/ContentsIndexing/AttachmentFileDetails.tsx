import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';

import { useState, useEffect } from "react";


export const AttachmentFileDetails = () => {

    const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsAttachmentFile/GetAttachmentFileDetails/");

    const [loading, setLoading] = useState(true);


    const [isActive, setIsActive] = useState(false);
    const [type_data, setType_data] = useState("");
    const [file_name, setFile_name] = useState("");


    const [file_length, setFile_length] = useState(0);

    const [itemlink, setItemlink] = useState("");
    const [license, setLicense] = useState("");
    const [memo, setMemo] = useState("");

    const [create_datetime, setCreate_datetime] = useState(null);
    const [latest_update_datetime, setLatest_update_datetime] = useState(null);

    const [target_article_id, setTarget_article_id] = useState(0);



    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(`${str_url_getapi}${id}`);
            const data = await response.json();

            setIsActive(data.isActive);
            setType_data(data.type_data);
            setFile_name(data.file_name);

            setFile_length(data.file_length);

            setItemlink(data.itemlink);
            setLicense(data.license);
            setMemo(data.memo);

            setCreate_datetime(data.create_datetime);
            setLatest_update_datetime(data.latest_update_datetime);

            setTarget_article_id(data.target_article_id);

            setLoading(false);
        };
        DataLoading();
    }
    );


    const renderBlock = () => {
        return (


            <div className="row">

                <div className="col-md-3"></div>


                <div className="col-md-6">

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link>


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
                            File Name
                        </dt>
                        <dd className="col-sm-10">
                            {file_name}
                        </dd>
                        <dt className="col-sm-2">
                            DATA TYPE
                        </dt>
                        <dd className="col-sm-10">
                            {type_data}
                        </dd>
                        <dt className="col-sm-2">
                            FileSize[KB]
                        </dt>
                        <dd className="col-sm-10">
                            {file_length / 1000}
                        </dd>
                        <dt className="col-sm-2">
                            Item Link
                        </dt>
                        <dd className="col-sm-10">
                            {itemlink}
                        </dd>
                        <dt className="col-sm-2">
                            license
                        </dt>
                        <dd className="col-sm-10">
                            {license}
                        </dd>
                    </dl>
                    <div>
                        <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link> |
                        <Link to={`/ContentsEdit/AttachmentFileEdit/${id}`}>Edit</Link>|
                        <Link to={`/ContentsEdit/AttachmentFileDelete/${id}`}>Delete</Link>|
                        <a href={`/ContentsEditAttachment/Edit/${id}`}>Edit(Old)</a> |
                        <a href={`/ContentsEditAttachment/Delete/${id}`}>Delete(Old)</a>
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


