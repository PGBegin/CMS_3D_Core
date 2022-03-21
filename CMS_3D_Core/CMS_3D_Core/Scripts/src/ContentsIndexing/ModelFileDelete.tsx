import * as React from "react";
import { useState, useEffect } from "react";

import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'


export const ModelFileDelete = () => {

    const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsModelFileApi/Details/");
    const [str_url_postapi, setStr_url_postapi] = useState("/ContentsModelFileApi/Delete/");
        
    const [loading, setLoading] = useState(true);
    const [part_number, setPart_number] = useState("");
    const [version, setVersion] = useState(0);
    const [type_data, setType_data] = useState("");

    const [file_name, setFile_name] = useState("");
    const [format_data, setFormat_data] = useState("");


    const [file_length, setFile_length] = useState(0);
    const [author, setAuthor] = useState("");
    const [itemlink, setItemlink] = useState("");
    const [license, setLicense] = useState("");
    const [memo, setMemo] = useState("");

    const [create_datetime, setCreate_datetime] = useState(null);
    const [latest_update_datetime, setLatest_update_datetime] = useState(null);



    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(`${str_url_getapi}${id}`);
            const data = await response.json();

            setPart_number(data.part_number);
            setVersion(data.version);
            setType_data(data.type_data);

            setFile_name(data.file_name);

            setFormat_data(data.format_data);
            setFile_length(data.file_length);
            setAuthor(data.author);
            setItemlink(data.itemlink);
            setLicense(data.license);
            setMemo(data.memo);

            setCreate_datetime(data.create_datetime);
            setLatest_update_datetime(data.latest_update_datetime);

            setLoading(false);
        };
        DataLoading();
    }
    );


    const handleSubmit = (event:any) => {

        const updObject = {
            id_part: id,
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

                    <h4>Model Management</h4>

                    <Link to="/ContentsEdit/ContentsModelFile">Return Index</Link>


                    <dl className="row">
                        <dt className="col-sm-2">
                            Part Number
                        </dt>
                        <dd className="col-sm-10">
                            {part_number}
                        </dd>
                        <dt className="col-sm-2">
                            Version
                        </dt>
                        <dd className="col-sm-10">
                            {version}
                        </dd>
                        <dt className="col-sm-2">
                            Create Datetime
                        </dt>
                        <dd className="col-sm-10">
                            {create_datetime}
                        </dd>
                        <dt className="col-sm-2">
                            DATA TYPE
                        </dt>
                        <dd className="col-sm-10">
                            {type_data}
                        </dd>
                        <dt className="col-sm-2">
                            Format
                        </dt>
                        <dd className="col-sm-10">
                            {format_data}
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
                            <a href={itemlink} target="_blank" rel="noopener noreferrer">{itemlink}</a>
                        </dd>
                        <dt className="col-sm-2">
                            License
                        </dt>
                        <dd className="col-sm-10">
                            {license}
                        </dd>
                        <dt className="col-sm-2">
                            Author
                        </dt>
                        <dd className="col-sm-10">
                            {author}
                        </dd>
                        <dt className="col-sm-2">
                            Memo
                        </dt>
                        <dd className="col-sm-10">
                            {memo}
                        </dd>
                    </dl>
                    <hr />

                    <form onSubmit={handleSubmit}>
                        <input type="submit" value="Delete" className="btn btn-danger" />
                    </form>

                    <hr />

                    <div>
                        <Link to="/ContentsEdit/ContentsModelFile">Return Index</Link> |
                        {<Link to={`/ContentsEdit/ModelFileDetails/${id}`}>Details</Link>} |
                        {<Link to={`/ContentsEdit/ModelFileEdit/${id}`}>Edit</Link>}
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