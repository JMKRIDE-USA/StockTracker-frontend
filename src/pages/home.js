import React, { useCallback } from 'react';

import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { PageCard, TitleCard  } from '../components/common.js';
import { selectCategorySetId } from '../redux/inventorySlice.js';
import { QueryLoader } from '../modules/data.js';
import { useGetAllCategoriesByCategorySet } from '../modules/inventory.js';
import { CategoryDisplayCard } from '../components/inventory-display.js';
import { CategorySetSelector } from '../components/selectors.js';
import { ReorderButton, EditButton, CreateButton } from '../components/buttons.js';


function AllCategories({categories}) {
  if(categories.length) {
    return categories.map((category, index) => (
      <div className="bar-chart-supercard" key={index}>
        <CategoryDisplayCard
          categoryId={category._id}
          categoryName={category.name}
          length={category.length}
        />
      </div>
    ));
  }
  return (
    <PageCard>
      No Categories found.<br/>
      Create one or edit the category set above to add an existing category.
    </PageCard>
  );
}

function Home() {
  const categoryQuery = useGetAllCategoriesByCategorySet()
  const history = useHistory()
  const currentCategorySet = useSelector(selectCategorySetId);
  const createCategory = useCallback(
    () => history.push('/create-category'),
    [history],
  );
  const reorderCategorySet = useCallback(
    () => history.push('/reorder-categoryset/' + currentCategorySet),
    [history, currentCategorySet],
  )
  const editCategorySet = useCallback(
    () => history.push('/edit-categoryset/' + currentCategorySet),
    [history, currentCategorySet],
  )
  const createCategorySet = useCallback(
    () => history.push('/create-categoryset'),
    [history],
  )
  return (
    <div className="page">
      <TitleCard title="Categories">
        <div className="flex-row flex-centered">
          <div className="text-bold">Current Category Set:</div>
          <CategorySetSelector/>
          <ReorderButton style={{marginRight: 5}} onClick={reorderCategorySet}/>
          <EditButton style={{marginRight: 5}} onClick={editCategorySet}/>
          <CreateButton onClick={createCategorySet}/>
        </div>
        <div className="flex-row flex-centered">
          <div className="text-bold" style={{marginRight: 20}}>
            Create Category:
          </div>
          <button className="btn btn-primary" onClick={createCategory}>
            <MdAdd size={30} color="white"/>
          </button>
        </div>
      </TitleCard>
      <QueryLoader query={categoryQuery} propName="categories" pageCard>
        <AllCategories/>
      </QueryLoader>
    </div>
  )
}

export default Home;
