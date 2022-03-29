import * as React from "react";
import * as ReactDOM from 'react-dom'

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

class ArticleData {
    id_article: number;
    title: string;
    id_assy: number;
    id_assy_name: string;
    status_name: string;
    id_attachment_for_eye_catch!: number;
    instructions_description_Length: number;
    instructions_description_Length_first: number;


    constructor() {
        this.id_article = 0;
        this.title = "";
        this.id_assy = 0;
        this.id_assy_name = "";
        this.status_name = "";
        this.instructions_description_Length = 0;
        this.instructions_description_Length_first = 0;
    }
}





export const ArticleIndex = () => {


    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsIndexingApis/GetArticleIndex");

    const [loading, setLoading] = useState(true);

    const [articledata, setArticledata] = useState<ArticleData[]>([]);

    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(str_url_getapi);
            const data = await response.json();

            //console.log(data);

            setArticledata(data!);

            setLoading(false);
        };
        DataLoading();
    }, []
    );


    const renderBlock = () => {
        return (
            <>

                <table className='table' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>ID Article</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Assembly</th>
                            <th>Delete</th>
                            <th>Length<br />(First Instruction)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articledata.map(articledata =>
                            <tr key={articledata.id_article}>
                                <td>
                                    <a href={`/ContentsEdit/EditArticleWholeContents?id_article=${articledata.id_article}`}>{articledata.id_article}</a>|
                                    {<Link to={`/ContentsEdit/ArticleDetails/${articledata.id_article}`}>articledata.id_article</Link>}
                                </td>
                                <td>{articledata.title}</td>
                                <td>{articledata.status_name}</td>
                                <td>
                                    <a href={`/t_assembly/Edit?id_assy=${articledata.id_assy}`}>[{articledata.id_assy}]{articledata.id_assy_name}</a>
                                </td>
                                <td><a className="btn btn-danger" href={`/t_article/Delete?id_article=${articledata.id_article}`}>Delete</a></td>
                                <td>{articledata.instructions_description_Length}({articledata.instructions_description_Length_first})</td>
                                <td>
                                    {articledata.id_attachment_for_eye_catch && <img className="img-thumbnail mb-3" src={`/ContentsEditAttachment/GetAttachmentFile/${articledata.id_attachment_for_eye_catch}`} alt="" width="240" height="135" loading="lazy"></img>}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>


            </>
        );


    };
    return (
        loading
            ? <p><em>Loading...</em></p>
            : renderBlock()

    );
}
