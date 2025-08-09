import React from 'react';

interface FormHeadingProps{
  title:string;
  description:string | React.ReactNode;
}

function FormHeading({title, description}:FormHeadingProps) {
  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <h1 className="bg-zinc-200 p-2 text-xl px-4 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold ">{title}</h1>
      <p className="pt-3 px-4 text-zinc-500 dark:text-zinc-400  ">{description}</p>
    </div>
  )
}

export default FormHeading