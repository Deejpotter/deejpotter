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
  // Use Tailwind gradient utilities. `gradientFrom` and `gradientTo` should be
  // color keys (e.g., "primary", "light", "info"). We map them to Tailwind
  // `from-...` and `to-...` utility classes so the classes are explicit in the file.
  const fromClass = `from-${gradientFrom}`;
  const toClass = `to-${gradientTo}`;

  return (
    <section className={`bg-gradient-to-b ${fromClass} ${toClass} ${textColour} py-20`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-extrabold">{title}</h1>
        <p className="mt-4 text-xl">{subtitle}</p>
      </div>
    </section>
  );
}
