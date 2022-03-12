import * as React from "react";
import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';

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
    attachmentfiledata!: AttachmentFileData;
    id_file: number;
    constructor() {
        this.loading = false;
        this.id_file = 0;
    }
}



class AttachmentFileDetails extends React.Component<any, State> {
    static displayName = AttachmentFileDetails.name;

    constructor(props: any) {
        super(props);
        this.state = { attachmentfiledata: new AttachmentFileData(), loading: true, id_file: props.id_file };
    }


    componentDidMount() {
        this.populateWeatherData();
    }

    static renderTable(attachmentfiledata: AttachmentFileData) {
        return (

            <div className="row">

                <div className="col-md-3"></div>


                <div className="col-md-6">

                    <h4>Attachment Management</h4>

                    <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link>


                    <dl className="row">
                        <dt className="col-sm-2">
                            Image
                        </dt>
                        <dd className="col-sm-12">
                            {
                                //attachmentfiledata.id_file && <img src={`/ContentsEditAttachment/GetAttachmentFile/${attachmentfiledata.id_file}`} alt="" loading="lazy"></img>
                            }
                            {attachmentfiledata.id_file && <img src={`/ContentsAttachmentFile/GetAttachmentFileObject/${attachmentfiledata.id_file}`} alt="" loading="lazy"></img>}
                        </dd>

                        <dt className="col-sm-2">
                            IF File
                        </dt>
                        <dd className="col-sm-10">
                            {attachmentfiledata.id_file}
                        </dd>
                        <dt className="col-sm-2">
                            File Name
                        </dt>
                        <dd className="col-sm-10">
                            {attachmentfiledata.file_name}
                        </dd>
                        <dt className="col-sm-2">
                            DATA TYPE
                        </dt>
                        <dd className="col-sm-10">
                            {attachmentfiledata.type_data}
                        </dd>
                        <dt className="col-sm-2">
                            FileSize[KB]
                        </dt>
                        <dd className="col-sm-10">
                            {attachmentfiledata.file_length / 1000}
                        </dd>
                        <dt className="col-sm-2">
                            Item Link
                        </dt>
                        <dd className="col-sm-10">
                            {attachmentfiledata.itemlink}
                        </dd>
                        <dt className="col-sm-2">
                            license
                        </dt>
                        <dd className="col-sm-10">
                            {attachmentfiledata.license}
                        </dd>
                    </dl>
                    <div>
                        <Link to="/ContentsEdit/AttachmentFileIndex">Return Index</Link> |
                        <a href={`/ContentsEditAttachment/Edit/${attachmentfiledata.id_file}`}>Edit</a> |
                        <a href={`/ContentsEditAttachment/Delete/${attachmentfiledata.id_file}`}>Delete</a>|
                        <Link to={`/ContentsEdit/AttachmentFileEdit/${attachmentfiledata.id_file}`}>Edit2</Link>|
                        <Link to={`/ContentsEdit/AttachmentFileDelete/${attachmentfiledata.id_file}`}>Delete2</Link>
                    </div>
                </div>

            </div>
        );
    }

    render() {
        //const { id } = useParams();
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : AttachmentFileDetails.renderTable(this.state.attachmentfiledata);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch(`/ContentsAttachmentFile/GetAttachmentFileDetails/${this.props.id_file}`);
        //const response = await fetch(`/ContentsAttachmentFile/GetAttachmentFilesDetails/${this.props.id_file}`);
        const data = await response.json();
        this.setState({ attachmentfiledata: data, loading: false, id_file: this.props.id_file });
    }
}


export function FAttachmentFileDetails() {
    const { id } = useParams();
    return (<AttachmentFileDetails id_file={id} />);
}