import React from 'react';

const portfolioAllocationModal = (props) => {
    return(
        <div>
            <input type="number" onChange={props.changed}></input>
        </div>
    );
}

export default portfolioAllocationModal