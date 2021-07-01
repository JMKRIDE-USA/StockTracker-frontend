import React, { useCallback } from 'react';

import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { PageCard } from '../components/common.js';
import { useGetCategory, useGetLogsByCategory } from '../modules/inventory.js';
import { CategoryDisplayCard } from '../components/inventory-display.js';
import { LogTable } from '../components/tables/logs.js';
import { QueryLoader } from '../modules/data.js';
import { InfoListFromObject } from '../components/lists.js';


const CategoryChart = ( {category} ) => ( 
  <CategoryDisplayCard
    categoryId={category._id}
    categoryName={category.name}
    length={category.length}
    viewButton={false}
  />
);

function CategoryTitleCard( {category} ) {
  const history = useHistory();
  const editCategory = useCallback(
    () => history.push('/category/edit/' + category._id),
    [history, category._id]
  )
  return (
    <div className="page-card">
      <div className="page-title">
        Category: {category.name}
      </div>
      <InfoListFromObject data={{
        ID: category._id,
      }}/>
      <button className="btn btn-secondary big-button" onClick={editCategory}>
        Edit / Reorder Parts
      </button>
    </div>
  );
}

export default function CategoryPage() {
  const { id } = useParams()
  const categoryQuery = useGetCategory(id);
  const logQuery = useGetLogsByCategory({categoryId: id})
  return (
    <div className="page">
      <QueryLoader
        query={categoryQuery}
        propName={"category"}
      >
        <CategoryTitleCard/>
        <CategoryChart/>
      </QueryLoader>
      <PageCard>
        <QueryLoader query={logQuery} propName={"logs"}>
          <h3> Update History: </h3>
          <LogTable/>
        </QueryLoader>
      </PageCard>
    </div>
  );
}
