import * as React from "react";
import * as ReactDOM from 'react-dom'

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';


class AssyData {
    id_assy: number;
    assy_name: string;
    t_articles_ref_Count: number;
    constructor() {
        this.id_assy = 0;
        this.assy_name = "";
        this.t_articles_ref_Count = 0;
    }
}


export const AssyIndex = () => {


    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsIndexingApis/GetAssyIndex");

    const [loading, setLoading] = useState(true);

    const [assydata, setAssydata] = useState<AssyData[]>([]);

    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(str_url_getapi);
            const data = await response.json();

            //console.log(data);

            setAssydata(data!);

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
                            <th>ID Assembly</th>
                            <th>Assy Name</th>
                            <th>Count Ref from Article</th>
                            <th>Operation</th>
                            <th>Instance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assydata.map(assydata =>
                            <tr key={assydata.id_assy}>
                                <td><a href={`/t_assembly/Edit?id_assy=${assydata.id_assy}`}>{assydata.id_assy}</a></td>
                                <td>{assydata.assy_name}</td>
                                <td>{assydata.t_articles_ref_Count}</td>
                                <td>
                                    {assydata.t_articles_ref_Count == 0 && <a className="btn btn-danger" href={`/t_assembly/Delete?id_assy=${assydata.id_assy}`}>Delete</a>}

                                </td>
                                <td>
                                    <a href={`/ContentsEdit/CreateInstancePart/?id_assy=${assydata.id_assy}`}>Add</a>
                                    |
                                    <a href={`/t_instance_part?id_assy=${assydata.id_assy}`}>List(for Delete)</a>
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
