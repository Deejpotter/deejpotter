import { ReactElement } from "react";

type GradientHeroSectionProps = {
  gradientFrom: string;
  gradientTo: string;
  subtitle: string;
  textColour: string;
  title: string;
};

/**
 * A hero section with a gradient background. This can be used at the top of a page then the section underneath should start with the colour from the gradientTo parameter.
 * The parameters should be bootstrap colour classes that will be used to create a gradient background.
 * @param gradientFrom String representing the gradient start colour to be added as a class to the section element.
 * @param gradientTo String representing the gradient end colour to be added as a class to the section element.
 * @param subtitle String representing the subtitle to be displayed in the hero section.
 * @param textColour String representing the text colour to be added as a class to the section element.
 * @param title String representing the title to be displayed in the hero section.
 */
export default function GradientHeroSection({
  gradientFrom,
  gradientTo,
  subtitle,
  textColour,
  title,
}: GradientHeroSectionProps): ReactElement {
  return (
    <section
      className={`${gradientFrom}-${gradientTo}-gradient text-${textColour} py-5`}
    >
      <div className="container text-center">
        <h1 className="display-1">{title}</h1>
        <p className="lead">{subtitle}</p>
      </div>
    </section>
  );
}
