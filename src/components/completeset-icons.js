import React, { useState } from 'react';

import styled from 'styled-components';

import { colorNameToHex, colorIsDark, CSPartPropertyList } from '../constants.js';


const genStyle = (completeSet, isAngle1) => CSPartPropertyList.map(property => (
  "#" + property + "-" + completeSet._id + "-" + (isAngle1 ? "1" : "2") + "{ " +
  "fill: " + colorNameToHex(completeSet[property].color) + "; " +
  "stroke: " + (colorIsDark(completeSet[property].color) ? "#fff" : "#000") + "; " +
  "stroke-width: 4;" +
  "}" 
)).concat(
  [
    "#jmklogo-" + completeSet._id + "-" + (isAngle1 ? "1" : "2") + "{fill: " 
    + (colorIsDark(completeSet[isAngle1 ? "rtruck" : "ltruck"].color) ? "#fff" : "#000") + ";}",
  ]
).join("\n");
  

function Angle1({completeSet}) {
  let style = genStyle(completeSet, true);
  const makeId = (id) => id + "-" + completeSet._id + "-1";
  return (
    <svg id={makeId("angle1")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 708.99 328.84">
      <defs>
        <style> {style} </style>
      </defs>
      <ellipse id={makeId("lwheel1")} cx="74.01" cy="221.81" rx="73" ry="73.5" transform="translate(-22.63 7.66) rotate(-5.82)"/>
      <ellipse id={makeId("lwheel2")} cx="251.52" cy="168.52" rx="73" ry="73.5" transform="translate(-16.3 25.4) rotate(-5.82)"/>
      <rect id={makeId("ldeck")} x="37.54" y="26.71" width="245.41" height="272.71" rx="51.57" transform="translate(-48.14 66.92) rotate(-20.91)"/>
      <rect id={makeId("lgrip")} x="46.13" y="36.25" width="228.24" height="253.62" rx="51.57" transform="matrix(0.93, -0.36, 0.36, 0.93, -48.14, 66.92)"/>
      <rect id={makeId("rdeck")} x="387.78" y="23.02" width="255.03" height="250.33" rx="51.57" transform="translate(-20.11 184.18) rotate(-20)"/>
      <ellipse id={makeId("rwheel2")} cx="408.49" cy="248.84" rx="80" ry="78.5"/>
      <ellipse id={makeId("rwheel1")} cx="628.49" cy="249.84" rx="80" ry="78.5"/>
      <polygon id={makeId("rtruck")} points="629.49 183.12 629.49 210.38 606.02 235.81 559.49 235.81 559.49 296.34 480.49 296.34 480.49 235.81 432.96 235.81 409.49 208.42 409.49 183.12 445.64 131.34 593.34 131.34 629.49 183.12"/>
      <g id={makeId("jmklogo")}>
        <path d="M563,184.18a.6.6,0,0,0,0,.78l20,23.84a.62.62,0,0,1,.14.39.6.6,0,0,1-.6.61H557.76a.6.6,0,0,1-.46-.22l-12.77-15.21a.59.59,0,0,0-.85-.08.58.58,0,0,0-.22.46v14.44a.6.6,0,0,1-.6.61h-19a.61.61,0,0,1-.61-.61V192.4a.6.6,0,0,0-.6-.6.64.64,0,0,0-.47.21l-8.56,10.2a.27.27,0,0,1-.07.08.6.6,0,0,1-.85-.08L504.17,192a.6.6,0,0,0-.85-.07.58.58,0,0,0-.22.46,17.4,17.4,0,0,1-17.4,17.4H453.25a.61.61,0,0,1-.61-.61v-19a.61.61,0,0,1,.61-.61H480.9a2,2,0,0,0,2-2V160a.6.6,0,0,1,.6-.61h19.3a.58.58,0,0,1,.46.22l9.45,11.25a.6.6,0,0,0,.85.08.27.27,0,0,0,.07-.08l9.45-11.25a.58.58,0,0,1,.46-.22h19.3a.6.6,0,0,1,.6.61v14.43a.61.61,0,0,0,.61.61.58.58,0,0,0,.46-.22l12.77-15.21a.6.6,0,0,1,.46-.22h24.77a.62.62,0,0,1,.39.14.61.61,0,0,1,.07.86Z" transform="translate(-0.5 -1)"/>
        <circle cx="463.33" cy="170.03" r="10.68" transform="translate(-3.45 7.27) rotate(-1.02)"/>
      </g>
    </svg>
  );
}

function Angle2({completeSet}) {
  let style = genStyle(completeSet, false);
  const makeId = (id) => id + "-" + completeSet._id + "-2";
  return (
    <svg id={makeId("angle2")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720.94 332.82">
      <defs>
        <style> {style} </style>
      </defs>
      <rect id={makeId("ldeck")} x="60.26" y="26.86" width="266.06" height="248.14" rx="51.57" transform="translate(65.7 -60.79) rotate(20.67)"/>
      <ellipse id={makeId("lwheel1")} cx="79.8" cy="250.39" rx="77.82" ry="79.3" transform="translate(-171.5 324.98) rotate(-89.33)"/>
      <ellipse id={makeId("lwheel2")} cx="297.86" cy="253.91" rx="77.82" ry="79.3" transform="translate(40.5 546.51) rotate(-89.33)"/>
      <polygon id={makeId("ltruck")} points="299.62 185.5 299.3 212.52 275.75 237.46 229.63 236.92 228.93 296.92 150.62 296.01 151.32 236.01 104.21 235.46 81.26 208.04 81.55 182.96 117.98 132.06 264.38 133.76 299.62 185.5"/>
      <g id={makeId("jmklogo")}>
        <path d="M233.2,187.08a.59.59,0,0,0,0,.77l19.55,23.86a.62.62,0,0,1,.14.39.6.6,0,0,1-.61.59l-24.55-.28a.58.58,0,0,1-.45-.22L214.8,197a.6.6,0,0,0-.85-.08.58.58,0,0,0-.22.45l-.17,14.31a.6.6,0,0,1-.6.6L194.15,212a.61.61,0,0,1-.59-.61l.19-16.64a.6.6,0,0,0-1.05-.4l-8.6,10-.08.08a.59.59,0,0,1-.84-.09l-8.37-10.21a.6.6,0,0,0-.84-.08.58.58,0,0,0-.22.46,17.24,17.24,0,0,1-17.44,17l-32.17-.38a.6.6,0,0,1-.6-.6l.22-18.81a.61.61,0,0,1,.61-.59l27.41.32a2,2,0,0,0,2-2l.32-27.41a.6.6,0,0,1,.61-.59l19.12.22a.67.67,0,0,1,.46.22l9.23,11.27a.59.59,0,0,0,.84.08.27.27,0,0,0,.08-.07l9.49-11a.64.64,0,0,1,.46-.21l19.13.23a.59.59,0,0,1,.59.6L214,177.14a.6.6,0,0,0,.59.61.57.57,0,0,0,.46-.21l12.83-14.93a.57.57,0,0,1,.46-.21l24.55.28a.63.63,0,0,1,.39.15.59.59,0,0,1,.06.84Z" transform="translate(0 -2.29)"/>
        <circle cx="134.59" cy="171.9" r="10.59" transform="translate(-1.06 -1.46) rotate(-0.35)"/>
      </g>
      <ellipse id={makeId("rwheel2")} cx="471.38" cy="245.66" rx="72.36" ry="72.86" transform="translate(-19.66 39.83) rotate(-5.01)"/>
      <ellipse id={makeId("rwheel1")} cx="648.07" cy="195.33" rx="72.36" ry="72.86" transform="translate(-14.59 55.08) rotate(-5.01)"/>
      <rect id={makeId("rdeck")} x="436.05" y="53.48" width="243.27" height="270.33" rx="51.57" transform="translate(40.76 -95.41) rotate(9.91)"/>
      <rect id={makeId("rgrip")} x="444.56" y="62.94" width="226.24" height="251.41" rx="51.57" transform="translate(40.76 -95.41) rotate(9.91)"/>
    </svg>
  );
}

const CSIconParent = styled.div`
  display: flex;
  max-width: 220px;
  min-width: 220px;
`

const HoverBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`

export function CompleteSetIcon({completeSet, absolute = false, position = "left"}) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <CSIconParent style={{[position]: 0, position: absolute ? "absolute" : "relative"}}>
      { isHovering 
        ? <Angle2 completeSet={completeSet}/> 
        : <Angle1 completeSet={completeSet}/>
      }
      <HoverBox 
        onMouseOver={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
      />
    </CSIconParent>
  );
}
