import React from 'react';

import { useGetAllCategories } from '../modules/inventory.js';
import { CategoryDisplay } from '../components/inventory-display.js';

function CategoryCard({categoryId, categoryName}) {
  return (
    <div className="chart-card bar-chart-card">
      <h3>{categoryName} Inventory</h3>
      <CategoryDisplay categoryId={categoryId}/>
    </div>
  )
}

function AllCategories() {
  const categoryQuery = useGetAllCategories()
  if (![categoryQuery].every((query) => query.status === 'success')) {
    return (
      <div> Categories loading... </div>
    )
  }
  if(!Object.hasOwnProperty.call(categoryQuery.data, 'result')) {
    return (
      <div className="page-card">
        <h3 className="error-text">Error loading categories!</h3>
        { JSON.stringify(categoryQuery.data) }
      </div>
    );
  }
  return categoryQuery.data["result"].map((category, index) => (
    <div className="bar-chart-supercard" key={index}>
      <CategoryCard categoryId={category._id} categoryName={category.name}/>
    </div>
  ));
}

function Home() {
  return (
    <body>
      <div className="page category-page">
        <div className="page-card">
          <h1>
            JMKRIDE StockTracker v2.0
          </h1>
          <div className="begoodpeople">
            Be Good People.
          </div>
        </div>
        <AllCategories/>
      </div>
    </body>
  )
}

export default Home;
