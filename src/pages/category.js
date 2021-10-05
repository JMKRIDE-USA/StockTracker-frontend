import React from 'react';

import { useParams } from 'react-router-dom';

import { TitleCard } from '../components/common.js';
import { InfoListFromObject } from '../components/lists.js';
import { useGetCategory } from '../modules/inventory.js';
import { CategoryDisplayCard } from '../components/inventory-display.js';
import { PageableLogTable } from '../components/tables/logs.js';
import { QueryLoader } from '../modules/data.js';


const CategoryChart = ( {category} ) => ( 
  <CategoryDisplayCard
    categoryId={category._id}
    categoryName={category.name}
    length={category.length}
    viewButton={false}
  />
);

function SingleCategoryPage({category}) {
  return (
    <>
      <TitleCard title={"Category: " + category.name}> 
        <InfoListFromObject data={{
          ID: category._id,
          "Created By": category.creator,
          "Created At": category.createdAt,
        }}/>
      </TitleCard>
      <CategoryChart category={category}/>
      <PageableLogTable
        endpoint={"logs/category/id/" + category._id}
        title={"Update History:"}
        subjectName="Part"
      />
    </>
  );
}

export default function CategoryPage() {
  const { id } = useParams()
  const categoryQuery = useGetCategory(id);
  return (
    <div className="page">
      <QueryLoader query={categoryQuery} propName={"category"}>
        <SingleCategoryPage/>
      </QueryLoader>
    </div>
  );
}
