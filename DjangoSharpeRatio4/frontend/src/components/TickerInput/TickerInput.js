import React from 'react';
    const input = (props) => {
        return(
            <div>
                <input type="text" value={props.value} onChange={props.changed}></input>
                <button onClick={props.submit}>Submit</button>
            </div>
        );        
    }
export default input;