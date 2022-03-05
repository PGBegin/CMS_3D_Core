
import * as React from "react";
import * as ReactDOM from 'react-dom'

const e = React.createElement;

// props として受け取る型の定義（`Props`部分の名前はどんな名前でも可）
class myState  {
    liked: boolean;
    constructor() {
        this.liked = false;
    }
}

export class LikeButton extends React.Component<any, myState> {
    constructor(props: any) {
        super(props);
//        this.state = { liked: false };
        this.state = new myState();
    }

    render() {
        
        if (this.state.liked) {
            return 'You liked this.';
        }
        return e(
            'button',
            { onClick: () => this.setState({ liked: true }) },
            'Like'
        );
    }
}
