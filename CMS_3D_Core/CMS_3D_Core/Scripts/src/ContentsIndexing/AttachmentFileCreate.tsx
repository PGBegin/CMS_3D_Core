import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { GetVerificationToken } from '../General/GetVerificationToken'
import { FetchPostApi } from '../General/FetchPostApi'




import { useState, useEffect } from "react";



export const AttachmentFileCreate = () => {

    const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsAttachmentFile/GetAttachmentFileDetails/");
    const [str_url_postapi, setStr_url_postapi] = useState("/ContentsAttachmentFile/Create/");


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
            formData.append("name", values.name);
            formData.append("format_data", values.format_data);
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

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link>


                    <form onSubmit={handleSubmit}>

                        <dl className="row">
                            <dt className="col-sm-2">
                                Name
                            </dt>
                            <dd className="col-sm-10">
                                <input type="text" className="form-control" name="name" defaultValue={values.name} onChange={handleInputChange} />
                            </dd>
                            <dt className="col-sm-2">
                                FORMAT DATA
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

                            <dt className="col-sm-2">
                                File
                            </dt>
                            <dd className="col-sm-10">
                                <input type="file" name="formFile" className="custom-file-input" onChange={handleChangeF} />
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

