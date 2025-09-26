import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

type Option = {
  label: string;
  value: string;
};
type SearchableSelectProps = {
  readonly options: Option[];
  disabled: boolean;
  onChange: (option: Option[] | null) => void;
  value: Option[];
};

function SearchableSelect({ options, disabled, onChange, value, }: SearchableSelectProps) {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[value]}
      isMulti
      isDisabled={disabled}
      value={value}
      onChange={(selected) => onChange(selected as Option[] | null)}
      options={options}
      className="text-zinc-900"
      classNames={{
        control: (state) =>
          `!rounded-sm !border ${
            state.isFocused
              ? "!border-zinc-500 !ring-1 !ring-blue-500"
              : "!border-gray-300 dark:!border-gray-600"
          } !bg-white dark:!bg-zinc-900 !text-gray-900 dark:!text-gray-100`,
        menu: () =>
          "!bg-white dark:!bg-zinc-800 !rounded-lg !border !border-gray-200 dark:!border-gray-700",
        option: (state) =>
          `!cursor-pointer !px-3 !py-2 ${
            state.isFocused
              ? "!bg-gray-100 dark:!bg-zinc-700"
              : "!bg-white dark:!bg-zinc-800"
          } ${
            state.isSelected
              ? "!bg-blue-600 !text-white"
              : "!text-gray-900 dark:!text-gray-100"
          }`,
        multiValue: () => "!bg-zinc-500 !text-white !rounded-md !px-2",
        multiValueLabel: () => "!text-white",
        multiValueRemove: (state) =>
          `ml-1 rounded-sm px-1 cursor-pointer bg-zinc-300 text-rose-800 ${
            state.isFocused
              ? "hover:bg-none text-rose-800"
              : "text-rose-800 hover:bg-transparent duratoin-200 transition-all h-3 w-5 mt-2 rounded-lg "
          }`,
      }}
    />
  );
}

export default SearchableSelect;
