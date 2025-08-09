import React from 'react';

interface PageHeadingProps{
  title:string;
  description:string;
}

function PageHeading({title, description}:PageHeadingProps) {
  return (
    <div className="text-zinc-900 dark:text-zinc-100">
      <h1 className="text-xl text-zinc-950 dark:text-zinc-100 font-semibold  ">{title}</h1>
      <p className="pt-1 text-zinc-400 dark:text-zinc-500 text-sm ">{description}</p>
    </div>
  )
}

export default PageHeading