
import React, { useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Category, ProductOption } from "@prisma/client";

const animatedComponents = makeAnimated();
type SearchableSelectProps = {
  options:{
    label:string;
    value:string;
  }[];
  disabled:boolean;
  onChange:(option:{lable:string, value:string}) => void,
  value:{lable:string, value:string}
}

function SearchableSelect({options, disabled, onChange, value}:SearchableSelectProps) {

  return (
   <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[value]}
      isMulti
      isDisabled={disabled}
      onChange={}
      options={options}
    />
  )
}

export default SearchableSelect