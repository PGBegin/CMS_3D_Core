
import * as React from "react";
import { useState, useEffect } from "react";

import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'


export const ModelFileEdit = () => {

    const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsModelFileApi/Details/");
    const [str_url_postapi, setStr_url_postapi] = useState("/ContentsModelFileApi/Edit/");

    const [loading, setLoading] = useState(true);

    //----------------------------------------------------------------------
    const [values, setValues] = useState({
        part_number: '',
        version: 0,
        type_data: '',
        file_name: '',
        format_data: '',
        file_length: 0,

        author: '',
        itemlink: '',
        license: '',
        memo: '',
        create_datetime: null,
        latest_update_datetime: null,
    });



    useEffect(() => {
        const DataLoading = async () => {

            const response = await fetch(`${str_url_getapi}${id}`);
            const data = await response.json();

            setValues({
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
                latest_update_datetime: data.latest_update_datetime
            });

            setLoading(false);
        };
        DataLoading();
        console.log("called");
    },[]
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
            id_part: id,
            part_number: values.part_number,
            version: values.version,
            type_data: values.type_data,
            file_name: values.file_name,
            format_data: values.format_data,
            author: values.author,
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

                    <h4>Model Management</h4>

                    <Link to="/ContentsEdit/ContentsModelFile">Return Index</Link>


                    <dl className="row">
                        <dt className="col-sm-2">
                            Part Number
                        </dt>
                        <dd className="col-sm-10">{values.part_number} 
                            <input type="text" className="form-control" name="part_number" defaultValue={values.part_number} onChange={handleInputChange} />
                        </dd>
                        <dt className="col-sm-2">
                            Version
                        </dt>
                        <dd className="col-sm-10">
                            <input type="number" className="form-control" name="version" defaultValue={values.version} onChange={handleInputChange} />
                        </dd>
                        <dt className="col-sm-2">
                            Create Datetime
                        </dt>
                        <dd className="col-sm-10">
                            {values.create_datetime}
                        </dd>
                        <dt className="col-sm-2">
                            DATA TYPE
                        </dt>
                        <dd className="col-sm-10">
                            <input type="text" className="form-control" name="type_data" defaultValue={values.type_data} onChange={handleInputChange} />
                        </dd>
                        <dt className="col-sm-2">
                            Format
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
                            License
                        </dt>
                        <dd className="col-sm-10">
                            <input type="text" className="form-control" name="license" defaultValue={values.license} onChange={handleInputChange} />
                        </dd>
                        <dt className="col-sm-2">
                            Author
                        </dt>
                        <dd className="col-sm-10">
                            <input type="text" className="form-control" name="author" defaultValue={values.author} onChange={handleInputChange} />
                        </dd>
                        <dt className="col-sm-2">
                            Memo
                        </dt>
                        <dd className="col-sm-10">
                            <input type="text" className="form-control" name="memo" defaultValue={values.memo} onChange={handleInputChange} />
                        </dd>
                    </dl>
                    <hr />

                    <form onSubmit={handleSubmit}>
                        <input type="submit" value="Save" className="btn btn-primary" />
                    </form>

                    <hr />

                    <div>
                        <Link to="/ContentsEdit/ContentsModelFile">Return Index</Link> |
                        {<Link to={`/ContentsEdit/ModelFileDetails/${id}`}>Details</Link>} |
                        {<Link to={`/ContentsEdit/ModelFileDelete/${id}`}>Delete</Link>}
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