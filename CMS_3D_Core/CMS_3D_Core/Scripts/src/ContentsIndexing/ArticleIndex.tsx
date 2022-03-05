import * as React from "react";
import * as ReactDOM from 'react-dom'

// props として受け取る型の定義（`Props`部分の名前はどんな名前でも可）
class Forecast {
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

// props として受け取る型の定義（`Props`部分の名前はどんな名前でも可）
class myState {
    loading: boolean;
    //    forecasts: Forecast[];
    forecasts: Forecast[] = [];
    constructor() {
        this.loading = false;
    }
}






export class ArticleIndex extends React.Component<any, myState> {
    static displayName = ArticleIndex.name;

    constructor(props: any) {
        super(props);
        this.state = { forecasts: [], loading: true };
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static renderForecastsTable(forecasts: Forecast[]) {
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
                    {forecasts.map(forecast =>
                        <tr key={forecast.id_article}>
                            <td><a href={`/ContentsEdit/EditArticleWholeContents?id_article=${forecast.id_article}`}>{forecast.id_article}</a></td>
                            <td>{forecast.title}</td>
                            <td>{forecast.status_name}</td>
                            <td>
                                <a href={`/t_assembly/Edit?id_assy=${forecast.id_assy}`}>[{forecast.id_assy}]{forecast.id_assy_name}</a>
                            </td>
                            <td><a className="btn btn-danger" href={`/t_article/Delete?id_article=${forecast.id_article}`}>Delete</a></td>
                            <td>{forecast.instructions_description_Length}({forecast.instructions_description_Length_first})</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : ArticleIndex.renderForecastsTable(this.state.forecasts);

        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('/ContentsIndexingApis/GetArticleIndex');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}