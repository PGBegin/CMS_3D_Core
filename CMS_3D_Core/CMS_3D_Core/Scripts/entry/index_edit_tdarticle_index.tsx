import * as React from "react";
import * as ReactDOM from 'react-dom'
import { ContentsEditIndex } from '../src/ContentsIndexing/ContentsEditIndex';




// ロード後に実行される処理
function startup() {

    
    ReactDOM.render(

        <React.StrictMode>

            <ContentsEditIndex />
        </React.StrictMode>,
        document.getElementById("root")

    );
    


}


//Load時のイベントリスナ追加
window.addEventListener('load', startup);