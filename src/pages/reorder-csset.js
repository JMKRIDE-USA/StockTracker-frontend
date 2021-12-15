import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { QueryLoader, BackButton, TitleCard } from 'jeffdude-frontend-helpers';
import { OrderableList } from '../components/orderable-list.js';
import { useGetAllCS, useGetCSSetById, useSetCSSetCSOrder } from '../modules/inventory.js';


function CSSetCSList({completeSets, CSSet}) {
  const history = useHistory();
  const goBack = useCallback(
    () => history.push('/completeset/'),
    [history]
  )
  const useMakeReorderFn = (options) => 
    useSetCSSetCSOrder(CSSet._id, options);

  return (
    <>
      <TitleCard title={"Reorder CS Set: " + CSSet.name}/>
      <OrderableList
        makeReorderFn={useMakeReorderFn}
        items={completeSets}
        topMargin
      >
        <BackButton onClick={goBack}/>
      </OrderableList>
    </>
  );
}

export default function EditCSSetPage() {
  const { id } = useParams();
  const CSQuery = useGetAllCS({CSSet: id});
  const CSSetQuery = useGetCSSetById(id);
  return (
    <div className="page">
      <QueryLoader query={CSQuery} propName={"completeSets"}>
        <QueryLoader query={CSSetQuery} propName={"CSSet"}>
          <CSSetCSList/>
        </QueryLoader>
      </QueryLoader>
    </div>
  );
}
