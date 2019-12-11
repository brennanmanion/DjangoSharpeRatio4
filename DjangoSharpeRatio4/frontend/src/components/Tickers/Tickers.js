import React, { Component } from 'react'
import Ticker from './Ticker/Ticker'
import Input from '../TickerInput/TickerInput';
import axios from 'axios';
import PortfolioAllocation from '../PortfolioAllocationButton/PortfolioAllocationButton';
import SharpeRatioPlaceholder from '../SharpeRatioPlaceholder/SharpeRatioPlaceholder';
import PortfolioAllocationModal from '../PortfolioAllocationModal/PortfolioAllocationModal';
export default class Tickers extends Component {
    
    state = {
        tickers: null,
        invalidTickers: null,
        tickerArray:null,
        appendedData:false,
        showPortfolioAllocation:false,
        showDataLoading: false,
        sharpeRatio:null,
    }

    portfolioAllocationHandler = () => {
        this.setState({
            showPortfolioAllocation: true
        })
    }

    inputTickerHandler = (event) => {                
        let inputString = event.target.value;
        
        let tickerArray = [inputString.toUpperCase()]
        if(inputString.includes(',')){
            if(inputString.indexOf(' ') >= 0){
                tickerArray = inputString.toUpperCase().replace(/ /g, '').split(',');    
            }
            else{
                tickerArray = inputString.toUpperCase().split(',');
            }            
        }      
        this.validateTicker(tickerArray);
        
    }    

    submitTickerArrayHandler = () => {
        this.setState(
            {appendedData:false,showDataLoading:true}
            )
        const tickerArray = this.state.tickerArray;   
        this.calculateSharpeRatio(tickerArray)     
    }

    validateTicker = (inputTickers) => {
        axios({
            method: "post",
            url: "/verify_valid_ticker/",
            data: {
                tickers: inputTickers
            },
            xsrfHeaderName: "X-CSRFToken"            
        }).then(response => {            
            let validTickers = response.data.tickersMatch.map(ticker => {
                return(
                    {"ticker":ticker,"percentChange":null,"price":null,"weight":null}
                )
            })            
            console.log('validateTickers')
            console.log(response.data.tickersMatch)            

            this.setState({
                tickers: validTickers,
                invalidTickers: response.data.tickersNotMatch,
                tickerArray:response.data.tickersMatch
            })
        })
    }

    calculateSharpeRatio = (inputTickers) => {
        console.log('calculateSharpeRatio');
        console.log(inputTickers)
        axios({
            method: "post",
            url: "/calculate_sharpe_ratio/",
            data: {
                tickers: inputTickers
            },
            xsrfHeaderName: "X-CSRFToken"            
        }).then(response => {

            const sharpeRatio = response.data.SharpeRatio;
            const newStateTickers = response.data.setState;
            console.log('calculateSharpeRatio')
            console.log(newStateTickers);
            this.setState({tickers:newStateTickers})
            this.setState({appendedData:true,showDataLoading:false})
            this.setState({sharpeRatio:sharpeRatio})
            // const relevantData = response.data;
            // const change = relevantData.Change;
            // const price = relevantData.Price;
            // const weights = relevantData.Weights;
            // const sharpeRatio = relevantData.SharpeRatio;
            
            // let oldStateTickers = this.state.tickers;
            // let newStateTickers = [];
            // for(let i=0;i++;i<oldStateTickers.length){
            //     if((oldStateTickers[i]['ticker']==change[i]['ticker']) && 
            //         (oldStateTickers[i]['ticker']==price[i]['ticker']) && 
            //         (oldStateTickers[i]['ticker']==weights[i]['ticker'])){
            //             newStateTickers.push(
            //                 {"ticker":oldStateTickers[i]['ticker'],"percentChange":change[i]['ticker'],"price":price[i]['ticker'],"weight":weights[i]['ticker']}
            //             )
            //     }
            // }
            // Set The State
            // this.setState({
            //     tickers:newStateTickers
            // })
        })        
    }

    portfolioAllocationModalHandler = (event) => {
        let investmentAmmount = event.target.value; 
        let portfolioAllocation = this.state.tickers.map(ticker => {
            return(
                {"ticker":ticker.ticker,"percentChange":ticker.percentChange,"price":ticker.price,"weight":ticker.weight,"allocation":Math.floor(parseFloat(investmentAmmount)*parseFloat(ticker.weight)/parseFloat(ticker.price))}
            )
        })
        this.setState({tickers:portfolioAllocation})
    }

    componentDidMount(){
        let stateTickers = this.state.tickers; 
        console.log('[componentDidMount]')       
        console.log(this.state.tickers!=null);
        console.log('did npm run dev?')
        if(this.state.tickers!=null){

            let postTickers = stateTickers.map(ticker => {
                return(
                    ticker.ticker
                )
            })
            console.log('componentDidMount before post request')
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
    }    

    render() {
        let tickersMap = null;        
        if(this.state.tickers!=null){
            tickersMap = this.state.tickers.map(ticker => {
                return(
                    <Ticker 
                    ticker = {ticker.ticker}
                    percentChange = {ticker.percentChange}
                    price = {ticker.price}
                    weight = {ticker.weight}
                    showDataLoading = {this.state.showDataLoading}
                    loading="Loading..."
                    allocation={ticker.allocation}
                    showPortfolioAllocation={this.state.showPortfolioAllocation}
                    />
                )
            })            
        }
        return (
            <div>
                <Input 
                changed={this.inputTickerHandler} 
                submit={this.submitTickerArrayHandler}
                />
                {this.state.sharpeRatio ? <SharpeRatioPlaceholder sharpeRatio={this.state.sharpeRatio} />: null}
                {tickersMap}
                {this.state.appendedData ? <PortfolioAllocation clicked={this.portfolioAllocationHandler}/> : null}
                <PortfolioAllocationModal 
                changed={this.portfolioAllocationModalHandler}
                />
            </div>
        )
    }
}
