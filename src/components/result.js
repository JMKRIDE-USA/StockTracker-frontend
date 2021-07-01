import React from 'react';

import { HiCheckCircle, HiExclamation } from 'react-icons/hi';

export function ResultIndicator({result, dark = false}) {
  return (
    <div className="result-indicator">
      {!!result 
        ? <div style={{color: dark ? "white" : "black"}}>
            <HiCheckCircle size={30} color={dark ? "lightgreen" : "green"}/>
            Success!
          </div>
        : <div className="error-text" style={{color: dark ? "lightred" : "red"}}>
            <HiExclamation size={30} color={"red"}/>
            Failed!
          </div>
      }
    </div>
  )
}

