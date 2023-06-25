import {ReactElement} from "react";
import GradientHeroSection from "@/templates/GradientHeroSection/GradientHeroSection";
import BasicSection from "@/templates/BasicSection/BasicSection";

export default function Home(): ReactElement {
  return (<>
    <GradientHeroSection title="Deej Potter" subtitle="A pretty good developer." gradientFrom="primary" gradientTo="light" textColour={"dark"}/>
    <BasicSection heading="Basic section heading" paragraph="Basic section paragraph."/>
  </>)
}
