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
  return (
    <section
      className={`bg-${backgroundColour} text-${textColour} py-5`}
    >
      <div className="container">
        <h2>{heading}</h2>
        <p>{paragraph}</p>
      </div>
    </section>
  );
}
