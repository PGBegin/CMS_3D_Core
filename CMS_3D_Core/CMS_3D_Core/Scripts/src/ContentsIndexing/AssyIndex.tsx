import * as React from "react";
import * as ReactDOM from 'react-dom'


class AssyData {
    id_assy: number;
    assy_name: string;
    t_articles_ref_Count: number;
    constructor() {
        this.id_assy = 0;
        this.assy_name = "";
        this.t_articles_ref_Count = 0;
    }
}


class State {
    loading: boolean;
    assydata: AssyData[] = [];
    constructor() {
        this.loading = false;
    }
}






export class AssyIndex extends React.Component<any, State> {
    static displayName = AssyIndex.name;

    constructor(props: any) {
        super(props);
        this.state = { assydata: [], loading: true };
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static renderTable(assydata: AssyData[]) {
        return (
            <table className='table' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>ID Assembly</th>
                        <th>Assy Name</th>
                        <th>Count Ref from Article</th>
                        <th>Operation</th>
                        <th>Instance</th>
                    </tr>
                </thead>
                <tbody>
                    {assydata.map(assydata =>
                        <tr key={assydata.id_assy}>
                            <td><a href={`/t_assembly/Edit?id_assy=${assydata.id_assy}`}>{assydata.id_assy}</a></td>
                            <td>{assydata.assy_name}</td>
                            <td>{assydata.t_articles_ref_Count}</td>
                            <td>
                                {assydata.t_articles_ref_Count == 0 && <a className="btn btn-danger" href={`/t_assembly/Delete?id_assy=${assydata.id_assy}`}>Delete</a>}
                                
                            </td>
                            <td>
                                <a href={`/ContentsEdit/CreateInstancePart/?id_assy=${assydata.id_assy}`}>Add</a>
                                |
                                <a href={`/t_instance_part?id_assy=${assydata.id_assy}`}>List(for Delete)</a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : AssyIndex.renderTable(this.state.assydata);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('/ContentsIndexingApis/GetAssyIndex');
        const data = await response.json();
        this.setState({ assydata: data, loading: false });
    }
}