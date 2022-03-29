import * as React from "react";
import * as ReactDOM from 'react-dom'

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';



class AttachmentFileData {
    id_file: number;
    isActive: boolean;
    file_name: string;
    type_data!: string;
    file_length!: number;
    itemlink!: string;
    license!: string;
    create_datetime!: Date;
    latest_update_datetime!: Date;
    target_article_id!: number;


    constructor() {
        this.id_file = 0;
        this.isActive = false;
        this.file_name = "";
    }
}


export const AttachmentFileIndex = () => {


    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsAttachmentFile/GetAttachmentFileIndex");

    const [loading, setLoading] = useState(true);

    const [attachments, setAttachments] = useState<AttachmentFileData[]>([]);

    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(str_url_getapi);
            const data = await response.json();

            //console.log(data);

            setAttachments(data!);

            setLoading(false);
        };
        DataLoading();
    }, []
    );


    const renderBlock = () => {
        return (
            <>


                <div className="row">

                    <div className="col-md-3"></div>


                    <div className="col-md-6">

                        <h4>Attachment Management</h4>

                        <Link to="/ContentsEdit">Return ContentsEdit</Link>
                        <br />
                        <Link to="/ContentsEdit/FAttachmentFileCreate">Create</Link>

                        <table className='table' aria-labelledby="tabelLabel">
                            <thead>
                                <tr>
                                    <th>ID File</th>
                                    <th>Thumbnail</th>
                                    <th>Name</th>
                                    <th>type_data</th>
                                    <th>FileSize[KB]</th>
                                    <th>Item Link</th>
                                    <th>license</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attachments.map(attachments =>
                                    <tr key={attachments.id_file}>
                                        <td>
                                            <Link to={`/ContentsEdit/AttachmentFileDetails/${attachments.id_file}`}>{attachments.id_file}</Link>
                                        </td>
                                        <td>
                                            {attachments.id_file &&
                                                <Link to={`/ContentsEdit/AttachmentFileDetails/${attachments.id_file}`}>
                                                    <img className="img-thumbnail mb-3" src={`/ContentsEditAttachment/GetAttachmentFile/${attachments.id_file}`} alt="" width="240" height="135" loading="lazy"></img>
                                                </Link>}
                                        </td>
                                        <td>{attachments.file_name}</td>
                                        <td>{attachments.type_data}</td>
                                        <td>{attachments.file_length / 1000}</td>
                                        <td>{attachments.itemlink}</td>
                                        <td>{attachments.license}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>


                    </div>

                </div>

            </>
        );


    };
    return (
        loading
            ? <p><em>Loading...</em></p>
            : renderBlock()

    );
}
