import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { TitleCard, BackButton, DeleteButton, ObjectForm, QueryLoader } from 'jeffdude-frontend-helpers';
import { MultiPartSelector, MultiCategorySetSelector } from '../components/selectors.js';
import { 
  useCreateCategory,
  useGetCategory,
  useGetPartsByCategory,
  usePatchCategory,
  useDeleteCategory,
} from '../modules/inventory.js';


const getStateList = (category, parts) => ([
  {
    key: "name", label: "Name",
    initialState: category ? category.name : "",
    component: (props) => (
      <input
        type="text" name="name"
        className="form-control" placeholder="New Category" 
        {...props}
      />
    ),
    formatFn: _=>_,
  },
  {
    key: "categorySetIds", label: "Category Sets",
    initialState: (category
      ? category.categorySets.map(c => (
        {value: c.categorySet?._id, label: c.categorySet?.name}
      )) : []
    ),
    component: MultiCategorySetSelector,
    formatFn: categorySets => categorySets.map(c => c.value),
  },
  {
    key: "partIds", label: "Parts",
    initialState: (parts
      ? parts.map(c => ({value: c._id, label: c.name}))
      : []
    ),
    component: MultiPartSelector,
    formatFn: parts => parts.map(c => c.value),
  },
])

function CreateCategoryCard() {
  const useMakeSubmitFn = (options) =>
    useCreateCategory(options);
  const stateList = getStateList()

  return (
    <ObjectForm
      useMakeSubmitFn={useMakeSubmitFn} buttonText="Submit"
      stateList={stateList} 
    />
  );
}

function EditCategoryCard({category, parts}) {
  const stateList = getStateList(category, parts);
  const useMakeSubmitFn = (options) =>
    usePatchCategory(category._id, options);
  const history = useHistory();
  const backToHome = useCallback(
    () => history.push('/'),
    [history],
  )
  const useMakeDeleteFn = (options) => useDeleteCategory(category._id, options);
  return (
    <ObjectForm
      stateList={stateList}
      buttonText="Save"
      clearStateOnSubmit={false}
      useMakeSubmitFn={useMakeSubmitFn}
      formStyle={{marginTop: 20}}
    >
      <BackButton onClick={backToHome}/>
      <DeleteButton useMakeSubmitFn={useMakeDeleteFn} onSuccess={backToHome}/>
    </ObjectForm>
  );
}

function CategoryLoader({id, children}) {
  const categoryQuery = useGetCategory(id);
  const partsQuery = useGetPartsByCategory(id);
  return (
    <QueryLoader query={categoryQuery} propName="category">
      <QueryLoader query={partsQuery} propName="parts">
        {children}
      </QueryLoader>
    </QueryLoader>
  )
}

export default function CreateCategory() {
  const { id } = useParams();
  return (
    <div className="page">
      <TitleCard title={id ? "Edit Category" : "Create Category"}/>
      {id 
        ? <CategoryLoader id={id}><EditCategoryCard/></CategoryLoader> 
        : <CreateCategoryCard/> 
      }
    </div>
  );
}
