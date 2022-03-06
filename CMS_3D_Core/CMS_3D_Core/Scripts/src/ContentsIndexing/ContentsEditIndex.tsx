﻿import * as React from "react";
import * as ReactDOM from 'react-dom'

import { ArticleIndex } from './ArticleIndex';
import { AssyIndex } from './AssyIndex';
import { AttachmentFilesIndex } from './AttachmentFilesIndex';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

export function ContentsEditIndex() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/ContentsEdit" element={<ContentsEditHome />} />
                <Route path="/ContentsEdit/AttachmentFilesIndex" element={<AttachmentFilesIndex />} />
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

                <a href="/ContentsEditFile">File Management</a>

                <hr />

                <h4>Attachment Management</h4>

                <Link to="/ContentsEdit/AttachmentFilesIndex">Attachment Management</Link>


            </div>

        </div>);
}