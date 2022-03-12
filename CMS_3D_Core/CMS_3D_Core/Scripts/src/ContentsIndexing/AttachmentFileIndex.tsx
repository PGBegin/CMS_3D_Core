import * as React from "react";
import * as ReactDOM from 'react-dom'

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


class State {
    loading: boolean;
    attachmentfiledata: AttachmentFileData[] = [];
    constructor() {
        this.loading = false;
    }
}



export class AttachmentFileIndex extends React.Component<any, State> {
    static displayName = AttachmentFileIndex.name;

    constructor(props: any) {
        super(props);
        this.state = { attachmentfiledata: [], loading: true };
    }


    componentDidMount() {
        this.populateWeatherData();
    }

    static renderTable(attachmentfiledata: AttachmentFileData[]) {
        return (

            <div className="row">

                <div className="col-md-3"></div>


                <div className="col-md-6">

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit">Return ContentsEdit</Link>

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
                            {attachmentfiledata.map(attachmentfiledata =>
                                <tr key={attachmentfiledata.id_file}>
                                    <td>
                                        <Link to={`/ContentsEdit/AttachmentFileDetails/${attachmentfiledata.id_file}`}>{attachmentfiledata.id_file}</Link>
                                    </td>
                                    <td>
                                        {attachmentfiledata.id_file &&
                                        <Link to={`/ContentsEdit/AttachmentFileDetails/${attachmentfiledata.id_file}`}>
                                            <img className="img-thumbnail mb-3" src={`/ContentsEditAttachment/GetAttachmentFile/${attachmentfiledata.id_file}`} alt="" width="240" height="135" loading="lazy"></img>
                                        </Link>}
                                    </td>
                                    <td>{attachmentfiledata.file_name}</td>
                                    <td>{attachmentfiledata.type_data}</td>
                                    <td>{attachmentfiledata.file_length / 1000}</td>
                                    <td>{attachmentfiledata.itemlink}</td>
                                    <td>{attachmentfiledata.license}</td>
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
            : AttachmentFileIndex.renderTable(this.state.attachmentfiledata);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('/ContentsAttachmentFile/GetAttachmentFileIndex');
        const data = await response.json();
        this.setState({ attachmentfiledata: data, loading: false });
    }
}