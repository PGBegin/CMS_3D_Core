import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

class ObjectData {

    id_part: number;
    part_number!: string;
    version!: string;
    type_data!: string;
    file_name!: string;
    format_data!: string;
    file_length!: number;
    license!: string;
    author!: string;
    itemlink!: string;
    memo!: string;
    create_datetime!: Date;
    latest_update_datetime!: Date;

    constructor() {
        this.id_part = 0;
    }
}


class State {
    loading: boolean;
    objectdata: ObjectData[] = [];
    constructor() {
        this.loading = false;
    }
}



export class ModelFileIndexComponent extends React.Component<any, State> {
    static displayName = ModelFileIndexComponent.name;

    constructor(props: any) {
        super(props);
        this.state = { objectdata: [], loading: true };
    }


    componentDidMount() {
        this.populateWeatherData();
    }

    renderTable(objectdata: ObjectData[]) {
        return (

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
                            {objectdata.map(objectdata =>
                                <tr key={objectdata.id_part}>
                                    <td>
                                        <Link to={`/ContentsEdit/ModelFileDetails/${objectdata.id_part}`}>{objectdata.id_part}</Link>
                                    </td>
                                    <td>{objectdata.file_name}</td>
                                    <td>{objectdata.type_data}</td>
                                    <td>{objectdata.file_length / 1000}</td>
                                    <td>{objectdata.itemlink}</td>
                                    <td>{objectdata.license}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                </div>

            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTable(this.state.objectdata);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('/ContentsModelFileApi/GetIndex');
        const data = await response.json();
        this.setState({ objectdata: data, loading: false });
    }
}







export function ModelFileIndex() {
    //const { id } = useParams();
    return (<ModelFileIndexComponent />);
}


