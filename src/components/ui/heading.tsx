import React from 'react';

interface HeadingProps{
  title:string;
  description:string;
}

function Heading({title, description}:HeadingProps) {
  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <h1 className="bg-zinc-200 p-2 text-xl px-4 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold ">{title}</h1>
      <p className="p-2 px-4">{description}</p>
    </div>
  )
}

export default Heading