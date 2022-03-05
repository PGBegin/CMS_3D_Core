import * as React from "react";
import * as ReactDOM from 'react-dom'
import { ArticleIndex } from '../src/ContentsIndexing/ArticleIndex';
import { AssyIndex } from '../src/ContentsIndexing/AssyIndex';


// ロード後に実行される処理
function startup() {

    
    ReactDOM.render(

        <React.StrictMode>
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

                    <a href="/ContentsEditAttachment">Attachment Management</a>

                </div>

            </div>
        </React.StrictMode>,
        document.getElementById("root")

    );
    


}


//Load時のイベントリスナ追加
window.addEventListener('load', startup);