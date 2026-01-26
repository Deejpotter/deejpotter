import Link from "next/link";
import React from "react";

// TileProps defines the props that can be passed to the Tile component and are required for TypeScript to work properly.
export interface TileProps {
  title: string; // Required: This is the title of the tile.
  description: string; // Required: This is the description of the tile.
  link: string; // Required: This is the link that the tile will redirect to.
  linkText: string; // Required: This is the text that will be displayed on the button.
  bgColorClass?: string; // Optional, as Bootstrap classes have default values
  textColorClass?: string; // Optional again
}

// React.FC is a generic type that is used to define a React Functional Component.
// It takes a type argument which is the type of the props that will be passed to the component.
// In this case, the props are of type TileProps and they are destructured in the function signature into their individual properties.
const Tile: React.FC<TileProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass = "bg-gray-100", // Default to bg-light
  textColorClass = "text-gray-800", // Default to text-dark
}) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-2">
      {/* Use the passed in props to set the content and styles */}
      <div
        className={`flex flex-col h-full shadow-lg rounded-lg ${bgColorClass} ${textColorClass}`}
      >
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-base">{description}</p>
        </div>
        <div className="p-6 pt-0">
          {/* Use Link styled as a button instead of button inside Link for valid HTML and better accessibility */}
          <Link
            href={link}
            className="inline-block bg-transparent hover:bg-secondary text-secondary font-semibold hover:text-white py-2 px-4 border border-secondary hover:border-transparent rounded"
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
