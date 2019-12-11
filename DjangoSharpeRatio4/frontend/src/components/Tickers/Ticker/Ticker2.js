import React, { Component } from 'react'
import classes from './Ticker.module.css'
export default class Ticker2 extends Component {
    
    state = {
        ticker:this.props.ticker,
        percentChange:this.props.percentChange,
        price:this.props.price,
        weight:this.props.weight,
    }
    
    componentDidMount(){
        postTicker = this.state.ticker;

        axios({
            method: "post",
            url: "/calculate_sharpe_ratio/",
            data: {
                tickers: postTickers
            },
            xsrfHeaderName: "X-CSRFToken"            
        }).then(response => {

            const relevantData = response.data;
            const change = relevantData.Change;
            const price = relevantData.Price;
            const weights = relevantData.Weights;
            const sharpeRatio = relevantData.SharpeRatio;
            
            let oldStateTickers = this.state.tickers;
            let newStateTickers = [];
            for(let i=0;i++;i<oldStateTickers.length){
                if((oldStateTickers[i]['ticker']==change[i]['ticker']) && 
                    (oldStateTickers[i]['ticker']==price[i]['ticker']) && 
                    (oldStateTickers[i]['ticker']==weights[i]['ticker'])){
                        newStateTickers.push(
                            {"ticker":oldStateTickers[i]['ticker'],"percentChange":change[i]['ticker'],"price":price[i]['ticker'],"weight":weights[i]['ticker']}
                        )
                }
            }
        })
    }       

    render() {
        return (
            <div className={classes.Ticker}>
                <div>
                    {this.state.ticker}    
                </div>
                <div>
                    {this.state.percentChange}
                </div>
                <div>
                    {this.state.price}
                </div>
                <div>
                    {this.state.weight}
                </div>
            </div>
        )
    }
}
