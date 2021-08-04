import React from 'react';

export const InfoListFromObject = ({data, ellipses=false}) => {
  let components = [];
  for (const [key, value] of Object.entries(data)) {
    components.push((
      <div className="info-list-item">
        <div className="key">
          { key }:
        </div>
        <div>
          { value 
            ? typeof value === 'string'
            ? value
            : JSON.stringify(value) 
            : "<unknown>"
          }
        </div>
      </div>
    ))
  }
  return (
    <div className="info-list">
      { components.map((item, index) => <div key={index}>{item}</div>) }
      { ellipses && <div style={{alignSelf: "center", lineHeight: "50%"}}>...</div>}
    </div>
  );
}
