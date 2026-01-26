import { ReactElement } from "react";

type BasicSectionProps = {
  backgroundColour: string;
  textColour: string;
  heading: string;
  paragraph: string;
};

/**
 * A basic section with a background colour and text colour. This can be used for any section on a page.
 * @param backgroundColour String representing the background colour to be added as a class to the section element.
 * @param textColour String representing the text colour to be added as a class to the section element.
 * @param heading String representing the heading to be displayed in the section.
 * @param paragraph String representing the paragraph to be displayed in the section.
 */
export default function BasicSection({
  backgroundColour,
  textColour,
  heading,
  paragraph,
}: BasicSectionProps): ReactElement {
  // Note: For Tailwind to properly treeshake and include dynamic classes,
  // we cannot construct class names from variables like `bg-${backgroundColour}`.
  // Instead, the full class name must be present in the source.
  // A mapping object or switch statement is a common workaround.
  // However, for this migration, we'll assume the parent component passes the full class name.
  return (
    <section className={`${backgroundColour} ${textColour} py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">{heading}</h2>
        <p className="mt-4 text-lg">{paragraph}</p>
      </div>
    </section>
  );
}
