import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { QueryLoader } from 'jeffdude-frontend-helpers';
import { OrderableList } from '../components/orderable-list.js';
import {
  useGetPartsByCategory,
  useGetCategory,
  useSetCategoryOrder,
} from '../modules/inventory.js';


const CategoryPartsList = ({category, parts}) => {
  const history = useHistory();
  const viewCategory = useCallback(
    () => history.push('/category/' + category._id),
    [history, category._id]
  )
  const useMakeReorderFn = (options) => 
    useSetCategoryOrder(category._id, options);

  return (
    <OrderableList
      makeReorderFn={useMakeReorderFn}
      items={parts}
    >
      <div className="flex-row">
        <h3>Category: {category.name}</h3>
        <button
          className="btn btn-secondary"
          onClick={viewCategory}
          style={{marginLeft: "20px"}}
        >
          View
        </button>
      </div>
    </OrderableList>
  );
}

export default function EditCategoryPage() {
  const { id } = useParams();
  const categoryPartsQuery = useGetPartsByCategory(id, { noQuantity: true });
  const categoryQuery = useGetCategory(id);
  return (
    <div className="page">
      <QueryLoader query={categoryQuery} propName={"category"}>
        <QueryLoader query={categoryPartsQuery} propName={"parts"}>
          <CategoryPartsList/>
        </QueryLoader>
      </QueryLoader>
    </div>
  );
}
