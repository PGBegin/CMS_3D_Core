import * as React from "react";
import * as ReactDOM from 'react-dom'

// props として受け取る型の定義（`Props`部分の名前はどんな名前でも可）
class Forecast {
    date: any;
    temperatureC: any;
    temperatureF: any;
    summary: any;
    constructor() {
        this.date = 0;
        this.temperatureC = 0;
        this.temperatureF = 0;
        this.summary = 0;
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






export class FetchData extends React.Component<any, myState> {
    static displayName = FetchData.name;

    constructor(props : any) {
        super(props);
        this.state = { forecasts: [], loading: true };
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static renderForecastsTable(forecasts: Forecast[]) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderForecastsTable(this.state.forecasts);

        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}