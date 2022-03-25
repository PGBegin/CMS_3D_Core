import * as React from "react";
import * as ReactDOM from 'react-dom'

import { ArticleIndex } from './ArticleIndex';
import { AssyIndex } from './AssyIndex';
import { AttachmentFileIndex } from './AttachmentFileIndex';
import { AttachmentFileDetails } from './AttachmentFileDetails';
import { AttachmentFileDelete } from './AttachmentFileDelete';
import { AttachmentFileEdit } from './AttachmentFileEdit';
import { AttachmentFileCreate } from './AttachmentFileCreate';


import { ModelFileIndex } from './ModelFileIndex';

import { ModelFileCreate } from './ModelFileCreate';
import { ModelFileEdit } from './ModelFileEdit';
import { ModelFileDetails } from './ModelFileDetails';
import { ModelFileDelete } from './ModelFileDelete';


import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';

export function ContentsEditIndex() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/ContentsEdit" element={<ContentsEditHome />} />



                {
                    // Model
                }
                <Route path="/ContentsEdit/ContentsModelFile" element={<ModelFileIndex />} />
                <Route path="/ContentsEdit/ModelFileCreate" element={<ModelFileCreate />} />
                <Route path="/ContentsEdit/ModelFileEdit/:id" element={<ModelFileEdit />} />
                <Route path="/ContentsEdit/ModelFileDetails/:id" element={<ModelFileDetails />} />
                <Route path="/ContentsEdit/ModelFileDelete/:id" element={<ModelFileDelete />} />

                {
                    // Attachment
                }
                <Route path="/ContentsEdit/AttachmentFileIndex" element={<AttachmentFileIndex />} />
                <Route path="/ContentsEdit/FAttachmentFileCreate" element={<AttachmentFileCreate />} />
                <Route path="/ContentsEdit/AttachmentFileDetails/:id" element={<AttachmentFileDetails />} />
                <Route path="/ContentsEdit/AttachmentFileDelete/:id" element={<AttachmentFileDelete />} />
                <Route path="/ContentsEdit/AttachmentFileEdit/:id" element={<AttachmentFileEdit />} />
            </Routes>

        </BrowserRouter>
    );
}
function ContentsEditHome() {
    return (
        <div className="row">
            <div className="col-md-3"></div>


            <div className="col-md-6">

                <h4>Articles</h4>

                <p>
                    <a href="/t_article/Create">Create New Article</a>
                </p>
                <p>
                    <a href="/ContentsEdit/CreateArticle">Create New Article2</a>
                </p>

                <ArticleIndex />

                <hr />

                <h4>Assy</h4>
                <p>
                    <a href="/ContentsEdit/CreateAssembly">Create New Assembly</a>
                </p>

                <AssyIndex />


                <hr />

                <h4>Model Management</h4>

                <a href="/ContentsEditFile">File Management(Old)</a>

                <br />

                <Link to="/ContentsEdit/ContentsModelFile">Model File Management</Link>

                <hr />

                <h4>Attachment Management</h4>

                <Link to="/ContentsEdit/AttachmentFileIndex">Attachment File Management</Link>


            </div>

        </div>);
}