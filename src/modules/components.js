import React from 'react';

export function QueryLoader({query, propName, children}) {
  const propNoun = propName.chartAt(0).toUpperCase() + propName.slice(1);
  return onQuerySuccess(query, (data) => {
    if(!data.result) {
      return (
        <div className="page-card">
          <h3>{propNoun} Not Found.</h3>
        </div>
      );
    }
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {[propName]: data.result})
      }
      return child;
    });
  });
}
