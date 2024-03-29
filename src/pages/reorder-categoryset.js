import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { QueryLoader } from '../modules/data.js';
import { OrderableList } from '../components/orderable-list.js';
import { TitleCard } from '../components/common.js';
import { 
  useGetAllCategoriesByCategorySet,
  useGetCategorySetById,
  useSetCategorySetOrder,
} from '../modules/inventory.js';
import { BackButton } from '../components/buttons.js';


function CSSetCSList({categories, categorySet}) {
  const history = useHistory();
  const goBack = useCallback(
    () => history.push('/'),
    [history]
  )
  const useMakeReorderFn = (options) => 
    useSetCategorySetOrder(categorySet._id, options);

  return (
    <>
      <TitleCard title={"Category Set: " + categorySet.name}/>
      <OrderableList
        makeReorderFn={useMakeReorderFn}
        items={categories}
        topMargin
      >
        <BackButton onClick={goBack}/>
      </OrderableList>
    </>
  );
}

export default function ReorderCategorySetPage() {
  const { id } = useParams();
  const categoriesQuery = useGetAllCategoriesByCategorySet({categorySetId: id});
  const categorySet = useGetCategorySetById(id);
  return (
    <div className="page">
      <QueryLoader query={categoriesQuery} propName={"categories"}>
        <QueryLoader query={categorySet} propName={"categorySet"}>
          <CSSetCSList/>
        </QueryLoader>
      </QueryLoader>
    </div>
  );
}
