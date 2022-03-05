import * as React from "react";
import * as ReactDOM from 'react-dom'
import { ArticleIndex } from '../src/ContentsIndexing/ArticleIndex';


// ロード後に実行される処理
function startup() {

    
    ReactDOM.render(

        <React.StrictMode>
            <ArticleIndex />
        </React.StrictMode>,
        document.getElementById("root")

    );
    


}


//Load時のイベントリスナ追加
window.addEventListener('load', startup);