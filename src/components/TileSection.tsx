import React from "react";
import Tile, { TileProps } from "./Tile";

interface TileSectionProps {
  title: string;
  tiles: TileProps[];
}

const TileSection: React.FC<TileSectionProps> = ({ title, tiles }) => {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tiles.map((tile, index) => (
            <Tile key={index} {...tile} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TileSection;
