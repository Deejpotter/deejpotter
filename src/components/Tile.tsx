import Link from "next/link";
import React from "react";

export interface TileProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  bgColorClass?: string;
  textColorClass?: string;
}

const Tile: React.FC<TileProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass = "bg-white dark:bg-gray-900",
  textColorClass = "text-gray-800 dark:text-gray-100",
}) => {
  return (
    <div className="w-full p-2 sm:w-1/2 lg:w-1/3">
      <div className={`flex h-full flex-col rounded-3xl border border-gray-200/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 ${bgColorClass} ${textColorClass}`.trim()}>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-3 text-xl font-bold tracking-tight">{title}</h3>
          <p className="text-base leading-7 text-gray-700 dark:text-gray-300">{description}</p>
        </div>
        <div className="p-6 pt-0">
          <Link
            href={link}
            className="inline-flex items-center justify-center rounded-full border border-secondary/20 bg-transparent px-4 py-2 font-semibold text-secondary transition hover:border-secondary hover:bg-secondary hover:text-white"
            aria-label={`Learn more about ${title}`}
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tile;
