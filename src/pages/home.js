import React from 'react';


import { useGetAllCategories } from '../modules/inventory.js';
import { CategoryDisplayCard } from '../components/inventory-display.js';
import { CategorySetSelector } from '../components/selectors.js';

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
  let sortedCategories = categoryQuery.data.result;
  sortedCategories.sort((a,b) => (
    (a.sortIndex < b.sortIndex) ? -1
    : ((a.sortIndex > b.sortIndex) ? 1 : 0)
  ));
  return sortedCategories.map((category, index) => (
    <div className="bar-chart-supercard" key={index}>
      <CategoryDisplayCard
        categoryId={category._id}
        categoryName={category.name}
        length={category.length}
      />
    </div>
  ));
}

function TitleCard() {
  return (
    <div className="page-card">
      <h1>
        JMKRIDE StockTracker v2.0
      </h1>
      <div className="begoodpeople">
        Be Good People.
      </div>
      <div className="flex-column">
        <div className="flex-row flex-centered">
          <div className="text-bold">Current Category Set:</div>
          <CategorySetSelector/>
          <button className="btn btn-secondary">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="page">
      <TitleCard/>
      <AllCategories/>
    </div>
  )
}

export default Home;
