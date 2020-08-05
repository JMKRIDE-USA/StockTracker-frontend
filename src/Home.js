import React from 'react';
import jmklogo from './jmklogo.png';

export function Home() {
  return (
    <div className="MainPage">
      <img src={jmklogo} className="JMKRIDE-logo" alt="JMKRIDE-logo" />
      <p>
        JMKRIDE Stock Tracking System
      </p>
    </div>
  );
}
