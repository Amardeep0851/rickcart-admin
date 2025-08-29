import React from "react";
import CurrencyInput from "react-currency-input-field";

type CurrentyInputProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled: boolean;
  name: string;
};

function CurrentyInput({
  value,
  onChange,
  disabled,
  name,
}: CurrentyInputProps) {
  return (
    <>
      <CurrencyInput
        id="input-example"
        name={name}
        placeholder="Enter price"
        defaultValue={value}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        prefix="₹ "
        disabled={disabled}
        onValueChange={(value, name, values) => onChange(value)}
        className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0 border-[1px] py-1.5 shadow-sm  focus:border-zinc-400 rounded-sm dark:bg-zinc-900 px-3"
      />
    </>
  );
}

export default CurrentyInput;
