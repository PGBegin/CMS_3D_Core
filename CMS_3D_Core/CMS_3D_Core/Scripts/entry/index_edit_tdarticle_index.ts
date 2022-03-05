import * as React from "react";
import * as ReactDOM from 'react-dom'
import { LikeButton } from '../src/like_button';


// ロード後に実行される処理
function startup() {

    //    const e = React.createElement;
    const domContainer = document.querySelector('#like_button_container');
    ReactDOM.render(React.createElement(LikeButton), domContainer);
}


//Load時のイベントリスナ追加
window.addEventListener('load', startup);

