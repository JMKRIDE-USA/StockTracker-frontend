import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import chroma from 'chroma-js';
import Select from 'react-select';

import {
  QueryLoader,
  onQuerySuccess,
  queryClient,
} from '../modules/data.js';
import {
  setInventoryId,
  setCSSetId,
  selectCSSetId,
  selectInventoryId,
  setCategorySetId,
  selectCategorySetId,
  selectPartTypeCategories,
} from '../redux/inventorySlice.js';
import {
  useGetAllInventories,
  useGetAllCategorySets,
  useGetAllCategories,
  useGetAllCSSets,
  useGetAllCS,
  useGetAllParts,
  useGetPartsByCategory,
  useSetInventory,
  useSetCategorySet,
  useSetCSSet,
} from '../modules/inventory.js';
import { allColors } from '../constants.js';


export function GenericSelector({queryFn, onChange, selectedId, name, dark = false}) {
  return onQuerySuccess(
    queryFn(),
    (allItems) => (
      <select
        className={dark ? "selector-dark" : "selector"}
        onChange={onChange}
        value={selectedId}
      >
        { allItems.result.map(item => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    ),
    {name, pageCard: false},
  )
}

export function CategorySetSelector() {
  const selectedId = useSelector(selectCategorySetId);
  const dispatch = useDispatch();
  const setCategorySet = useSetCategorySet();

  const onChange = (event) => {
    dispatch(setCategorySetId(event.target.value));
    queryClient.invalidateQueries('structure-inventory');
    setCategorySet({id: event.target.value});
  }
  return GenericSelector({
    queryFn: useGetAllCategorySets,
    onChange, selectedId,
    name: 'all categorySets',
  });
}

export function InventorySelector({dark = false} = {}) {
  const selectedId = useSelector(selectInventoryId);
  const dispatch = useDispatch();
  const setInventory = useSetInventory();

  const onChange = (event) => {
    dispatch(setInventoryId(event.target.value));
    setInventory({id: event.target.value});
    queryClient.invalidateQueries('quantity-inventory');
  }
  return GenericSelector({
    queryFn: useGetAllInventories,
    onChange, selectedId,
    name: 'all inventories',
    dark: dark,
  });
}

export function CSSetSelector() {
  const selectedId = useSelector(selectCSSetId);
  const dispatch = useDispatch();
  const setCSSet = useSetCSSet();

  const onChange = (event) => {
    dispatch(setCSSetId(event.target.value));
    setCSSet({id: event.target.value});
    queryClient.invalidateQueries('cs-inventory');
  }
  return GenericSelector({
    queryFn: useGetAllCSSets,
    onChange, selectedId,
    name: 'all CS Sets',
  });
}

function LoadedMultiObjectSelector({objects, state}) {
  const options = objects.map(object => ({
    value: object._id,
    label: object.name,
  }));
  const [value, setValue] = state;
  return (
    <div style={{width: "100%"}}>
      <Select
        options={options} isMulti value={value}
        onChange={e => setValue(e)}
      />
    </div>
  );
}
export function MultiObjectSelector({query, ...props}) {
  return (
    <div style={{minWidth: "200px", maxWidth: "600px"}}>
      <QueryLoader query={query} propName="objects">
        <LoadedMultiObjectSelector {...props}/>
      </QueryLoader>
    </div>
  )
}

export function CategorySelector(props) {
  const allCategoriesQuery = useGetAllCategories();
  return <MultiObjectSelector query={allCategoriesQuery} {...props}/>
}

export function MultiCategorySetSelector(props){
  const allCategorySetsQuery = useGetAllCategorySets();
  return <MultiObjectSelector query={allCategorySetsQuery} {...props}/>
}

export function MultiCSSetSelector(props) {
  const allCSSetsQuery = useGetAllCSSets();
  return <MultiObjectSelector query={allCSSetsQuery} {...props}/>
}

export function MultiCSSelector(props) {
  const allCompleteSetsQuery = useGetAllCS({inCSSet: false});
  return <MultiObjectSelector query={allCompleteSetsQuery} {...props}/>
}
export function MultiPartSelector(props) {
  const allPartsQuery = useGetAllParts();
  return <MultiObjectSelector query={allPartsQuery} {...props}/>
}

function LoadedSingleCategorySelector({categories, state, componentStyle, ...props}) {
  const options = categories.map(category => ({
    value: category._id,
    label: category.name,
  }));
  const [value, setValue] = state;
  return (
    <div style={{...componentStyle, minWidth: 150}}>
      <Select
        {...props}
        options={options} value={value}
        onChange={e => setValue(e)}
      />
    </div>
  )
}

export function SingleCategorySelector(props) {
  const allCategoriesQuery = useGetAllCategories();
  return (
    <QueryLoader query={allCategoriesQuery} propName="categories">
      <LoadedSingleCategorySelector {...props}/>
    </QueryLoader>
  );
}

export function ColorSelector({state, id}) {
  const [value, setValue] = state;

  // credit/blame goes to react-select.com/styles
  const dot = (color = '#ccc') => ({
    alignItems: "center",
    display: "flex",
    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    }
  });
  const colorStyles = {
    control: styles => ({...styles, backgroundColor: 'white'}),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const colorValue = chroma(allColors[data.value]);
      return {
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? allColors[data.value]
          : isFocused
          ? colorValue.alpha(0.1).css()
          : null,
        color: isDisabled
          ? "#ccc" : 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? allColors[data.value] : colorValue.alpha(0.3).css()),
        },
      };
    },
    input: styles => ({...styles, ...dot() }),
    placeholder: styles => ({...styles, ...dot() }),
    singleValue: (styles, { data }) => ({...styles, ...dot(allColors[data.value])}),
  };
  const options = Object.keys(allColors).map(colorName => ({
    value: colorName, label: colorName,
  }))
  return (
    <div style={{minWidth: 150}} id={id}>
      <Select 
        label="Color Select"
        value={value}
        onChange={setValue}
        options={options}
        styles={colorStyles}
      />
    </div>
  )
}

const LoadedSinglePartSelector = ({parts, state}) => {
  const options = parts.map(part => ({
    value: part._id,
    label: part.name,
  }));
  const [value, setValue] = state;
  return (
    <div style={{width: "100%"}}>
      <Select
        isSearchable options={options} value={value}
        onChange={e => setValue(e)}
      />
    </div>
  );
}

export function SinglePartSelector({partType, ...props}) {
  const partTypeCategories = useSelector(selectPartTypeCategories)
  const allPartsQuery = useGetAllParts();
  let categoryId;
  if(partType && Object.hasOwnProperty.call(partTypeCategories, partType)) {
    categoryId = partTypeCategories[partType] 
  }
  const categoryQuery = useGetPartsByCategory(categoryId);
  return (
    <div style={{minWidth: 300}}>
      <QueryLoader query={categoryId ? categoryQuery : allPartsQuery} propName="parts">
        <LoadedSinglePartSelector {...props}/>
      </QueryLoader>
    </div>
  );
}