import React from 'react';

export const InfoListFromObject = ({data}) => {
  let components = [];
  for (const [key, value] of Object.entries(data)) {
    components.push((
      <div className="info-list-item">
        <div className="key">
          { key }:
        </div>
        <div>
          { value }
        </div>
      </div>
    ))
  }
  return (
    <div className="info-list">
      { components.map((item, index) => <div key={index}>{item}</div>) }
    </div>
  );
}
