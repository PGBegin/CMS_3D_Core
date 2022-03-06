import * as React from "react";
import * as ReactDOM from 'react-dom'


class ArticleData {
    id_article: number;
    title: string;
    id_assy: number;
    id_assy_name: string;
    status_name: string;
    instructions_description_Length: number;
    instructions_description_Length_first: number;
    constructor() {
        this.id_article = 0;
        this.title = "";
        this.id_assy = 0;
        this.id_assy_name = "";
        this.status_name = "";
        this.instructions_description_Length = 0;
        this.instructions_description_Length_first = 0;
    }
}


class State {
    loading: boolean;
    //    forecasts: Forecast[];
    articledata: ArticleData[] = [];
    constructor() {
        this.loading = false;
    }
}






export class ArticleIndex extends React.Component<any, State> {
    static displayName = ArticleIndex.name;

    constructor(props: any) {
        super(props);
        this.state = { articledata: [], loading: true };
    }


    componentDidMount() {
        this.populateWeatherData();
    }

    static renderTable(articledata: ArticleData[]) {
        return (
            <table className='table' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>ID Article</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Assembly</th>
                        <th>Delete</th>
                        <th>Length<br />(First Instruction)</th>
                    </tr>
                </thead>
                <tbody>
                    {articledata.map(articledata =>
                        <tr key={articledata.id_article}>
                            <td><a href={`/ContentsEdit/EditArticleWholeContents?id_article=${articledata.id_article}`}>{articledata.id_article}</a></td>
                            <td>{articledata.title}</td>
                            <td>{articledata.status_name}</td>
                            <td>
                                <a href={`/t_assembly/Edit?id_assy=${articledata.id_assy}`}>[{articledata.id_assy}]{articledata.id_assy_name}</a>
                            </td>
                            <td><a className="btn btn-danger" href={`/t_article/Delete?id_article=${articledata.id_article}`}>Delete</a></td>
                            <td>{articledata.instructions_description_Length}({articledata.instructions_description_Length_first})</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : ArticleIndex.renderTable(this.state.articledata);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('/ContentsIndexingApis/GetArticleIndex');
        const data = await response.json();
        this.setState({ articledata: data, loading: false });
    }
}