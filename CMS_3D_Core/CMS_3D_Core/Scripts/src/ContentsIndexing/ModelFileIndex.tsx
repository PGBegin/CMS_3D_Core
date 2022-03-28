import * as React from "react";
import * as ReactDOM from 'react-dom'
import { useState, useEffect } from "react";

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';





class ModelFile {

    id_part: number;
    part_number: string;
    version: number;
    type_data: string;
    format_data: string;
    file_name: string;
    file_length: number;
    itemlink: string;
    license: string;
    author: string;
    memo: string;
    create_datetime!: Date;
    latest_update_datetime!: Date;

    constructor(id_part: number, part_number: string, version: number, type_data: string,
        format_data: string, file_name: string, file_length: number, itemlink: string,
        license: string, author: string, memo: string, create_datetime: Date, latest_update_datetime: Date) {
        this.id_part = id_part;
        this.part_number = part_number;
        this.version = version;
        this.type_data = type_data;
        this.format_data = format_data;
        this.file_name = file_name;
        this.file_length = file_length;


        this.itemlink = itemlink;
        this.license = license;
        this.author = author;
        this.memo = memo;

        this.create_datetime = create_datetime;
        this.latest_update_datetime = latest_update_datetime;
    }
}


export const ModelFileIndex = () => {

    //const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsModelFileApi/Index");

    const [loading, setLoading] = useState(true);

    const [models, setModels] = useState<ModelFile[]>([]);

    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(str_url_getapi);
            const data = await response.json();

            //console.log(data);

            /*
            let models_temp: ModelFile[] = [];

            for (let i in data) {
  

                models_temp.push(new ModelFile(
                    data[i].id_part,
                    data[i].part_number,
                    data[i].version,
                    data[i].type_data,
                    data[i].format_data,
                    data[i].file_name,
                    data[i].file_length,
                    data[i].itemlink,
                    data[i].license,
                    data[i].author,
                    data[i].memo,
                    data[i].create_datetime,
                    data[i].latest_update_datetime,
                    
                ));

            }

            setModels(models_temp!);*/
            setModels(data!);

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

                        <h4>Model File Management</h4>

                        <Link to="/ContentsEdit">Return ContentsEdit</Link>
                        <br />
                        <Link to="/ContentsEdit/ModelFileCreate">Create</Link>

                        <table className='table' aria-labelledby="tabelLabel">
                            <thead>
                                <tr>
                                    <th>ID File</th>
                                    <th>Name</th>
                                    <th>type_data</th>
                                    <th>FileSize[KB]</th>
                                    <th>Item Link</th>
                                    <th>license</th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(models =>
                                    <tr key={models.id_part}>
                                        <td>
                                            <Link to={`/ContentsEdit/ModelFileDetails/${models.id_part}`}>{models.id_part}</Link>
                                        </td>
                                        <td>{models.file_name}</td>
                                        <td>{models.type_data}</td>
                                        <td>{models.file_length / 1000}</td>
                                        <td>{models.itemlink}</td>
                                        <td>{models.license}</td>
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
