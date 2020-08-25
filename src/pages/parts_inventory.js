import React from 'react';

import jmklogo from '../jmklogo.png';
import { ALL_PART_TYPES } from "../constants.js";
import { InventoryDisplay } from "./elements/inventory_display.js";

export function PartsInventoryPage() {

  return (
    <div className="MainPage">
      <img src={jmklogo} className="JMKRIDE-logo" alt="JMKRIDE-logo" />
      <p>
        JMKRIDE Stock Parts Inventory
      </p>
      <div className="AllInventoryDisplays">
        {
          ALL_PART_TYPES.map(
            (part_type) => <InventoryDisplay
                            className="InventoryDisplay"
                            part_type={part_type}
                            key={part_type}
                           />
          )
        }
      </div>
    </div>
  );
}
