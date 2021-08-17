import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { TitleCard } from '../components/common.js';
import { BackButton, DeleteButton } from '../components/buttons.js';
import { CategorySelector } from '../components/selectors.js';
import { 
  useCreateCategorySet,
  useGetCategorySetById,
  useGetAllCategoriesByCategorySet,
  usePatchCategorySet,
  useDeleteCategorySet,
} from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { ObjectForm } from '../components/object-form.js';


const getStateList = (categorySet, categories) => ([
  {
    key: "name", label: "Name",
    initialState: categorySet ? categorySet.name : "",
    component: (props) => (
      <input
        type="text" name="name"
        className="form-control" placeholder="New Category Set" 
        {...props}
      />
    ),
    formatFn: _=>_,
  },
  {
    key: "categoryIds", label: "Categories",
    initialState: categories ? categories.map(c => ({value: c._id, label: c.name})) : [],
    component: CategorySelector,
    formatFn: i => i.map(j => j.value),
    optional: true,
  },
])

function CreateCategorySetCard() {
  const stateList = getStateList();
  const useMakeSubmitFn = (options) =>
    useCreateCategorySet(options);

  return <ObjectForm {...{useMakeSubmitFn, stateList, buttonText: "Submit"}}/>
}

function EditCategorySetCard({categorySet, categories}) {
  const stateList = getStateList(categorySet, categories);
  const useMakeSubmitFn = (options) =>
    usePatchCategorySet(categorySet._id, options);

  const history = useHistory();
  const backToHome = useCallback(
    () => history.push('/'),
    [history],
  )
  const useMakeDeleteFn = (options) => useDeleteCategorySet(categorySet._id, options);

  return (
    <ObjectForm 
      {...{
        useMakeSubmitFn, stateList, buttonText: "Save", formStyle: {marginTop: 20},
        clearStateOnSubmit: false,
      }}
    >
      <BackButton onClick={backToHome}/>
      <DeleteButton useMakeSubmitFn={useMakeDeleteFn} onSuccess={backToHome}/>
    </ObjectForm>
  );
}

function CategorySetLoader({id, children}) {
  const categorySetQuery = useGetCategorySetById(id);
  const categoriesQuery = useGetAllCategoriesByCategorySet({CategorySet: id});
  return (
    <QueryLoader query={categorySetQuery} propName="categorySet">
      <QueryLoader query={categoriesQuery} propName="categories">
        {children}
      </QueryLoader>
    </QueryLoader>
  )
}

export default function CreateCategorySet() {
  const { id } = useParams();
  return (
    <div className="page">
      <TitleCard title={id ? "Edit Category Set" : "Create Category Set"}/>
      {id ? <CategorySetLoader id={id}><EditCategorySetCard/></CategorySetLoader> : <CreateCategorySetCard/> }
    </div>
  );
}
