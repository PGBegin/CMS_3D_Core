import * as React from "react";
import * as ReactDOM from 'react-dom'

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'




export const ModelFileCreate = () => {

    //const { id } = useParams();

    //const [str_url_getapi, setStr_url_getapi] = useState("/ContentsModelFileApi/Details/");
    const [str_url_postapi, setStr_url_postapi] = useState("/ContentsModelFileApi/Create/");

    const [loading, setLoading] = useState(true);

    //----------------------------------------------------------------------
    const [values, setValues] = useState({
        id:0,
        part_number: '',
        version: 0,
        format_data: '',

        author: '',
        itemlink: '',
        license: '',
        memo: '',

    });

    const [file_object, setFile_object] = useState(undefined);

    useEffect(() => {

        setLoading(false);

    }, []
    );

    function handleInputChange(e: any) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setValues({ ...values, [name]: value });
        console.log(values);
    }
    
    const handleChangeF = (event: any) => {

        let input = event.target;
        setFile_object(input.files[0]);
    }

    const handleSubmit = (event: any) => {




        event.preventDefault();
        const CreateUpdating = async () => {


            const token = GetVerificationToken();


            const formData = new FormData();
            //formData.append("MAX_FILE_SIZE", MAX_FILE_SIZE);  
            formData.append("part_number", values.part_number);
            formData.append("version", values.version.toString());
            formData.append("format_data", values.format_data);
            formData.append("author", values.author);
            formData.append("itemlink", values.itemlink);
            formData.append("license", values.license);
            formData.append("memo", values.memo);
            formData.append("formFile", file_object!);


            const param = {
                method: "POST",  // or "PUT",
                headers: {
                    "RequestVerificationToken": token
                },
                body: formData
            }



            //-------------------------------------------------
            // Send Server
            //-------------------------------------------------
            const response = await fetch(str_url_postapi,
                param
            );

            const ans = await response.json();


            alert(ans[0].updateresult_msg);


        };

        CreateUpdating();

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
                            Format
                        </dt>
                        <dd className="col-sm-10">
                            <input type="text" className="form-control" name="format_data" defaultValue={values.format_data} onChange={handleInputChange} />
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
                        <dt className="col-sm-2">
                            File
                        </dt>
                        <dd className="col-sm-10">
                            <input type="file" name="formFile" className="custom-file-input" onChange={handleChangeF} />
                        </dd>
                    </dl>
                    <hr />

                    <form onSubmit={handleSubmit}>
                        <input type="submit" value="Save" className="btn btn-primary" />
                    </form>

                    <hr />

                    <div>
                        <Link to="/ContentsEdit/ContentsModelFile">Return Index</Link>
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