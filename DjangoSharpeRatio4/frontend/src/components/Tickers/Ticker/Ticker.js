import React from 'react';
import classes from './Ticker.module.css'
import AllocationPlaceholder from './AllocationPlaceholder/AllocationPlaceholder';

const ticker = (props) => {
    let divClassName = [classes.Ticker]
    if(props.percentChange){
        {props.percentChange.includes('-') ? divClassName.push(classes.Negative) : divClassName.push(classes.Positive)}
    }    
    return(
        <div className={divClassName.join(' ')}>
            <div>
                {props.ticker}    
            </div>
            <div>
                {props.showDataLoading ? props.loading : props.percentChange}  
            </div>
            <div>
                {props.price}
            </div>
            <div>
                {props.weight}
            </div>
            <div>
                {props.showPortfolioAllocation ? <AllocationPlaceholder>{props.allocation}</AllocationPlaceholder> : null }
            </div>
        </div>
    );
}

export default ticker;