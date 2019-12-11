import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tickers from './Tickers/Tickers';
export default class App extends Component {
        
    render() {
        return (
            <div>
                Did npm run dev work?
                <Tickers/>
            </div>
        )
    }
}

ReactDOM.render(<App/>,document.getElementById('app'));