import { ReactElement } from "react";
import { GradientHeroSectionParams } from "@/templates/GradientHeroSection/GradientHeroSectionParams";

export default function GradientHeroSection({
  gradientFrom,
  gradientTo,
  subtitle,
  textColour,
  title,
}: GradientHeroSectionParams): ReactElement {
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
