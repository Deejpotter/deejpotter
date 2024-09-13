import {ReactElement} from "react";
import GradientHeroSection from "@/templates/GradientHeroSection/GradientHeroSection";
import BasicSection from "@/templates/BasicSection/BasicSection";
import { Popover, PopoverContent, PopoverTrigger, PopoverHeading, PopoverDescription, PopoverClose } from "@/components/Popover"
import { Container } from "react-bootstrap";

export default function Home(): ReactElement {
  return (<>
    <GradientHeroSection title="Deej Potter" subtitle="A pretty good developer." gradientFrom="primary" gradientTo="light" textColour={"dark"}/>
    <BasicSection heading="Basic section heading" paragraph="Basic section paragraph."/>
    <Container>
    <Popover>
        <PopoverTrigger>Test Popover</PopoverTrigger>
        <PopoverContent className="Popover">
          <PopoverHeading>Test popover heading</PopoverHeading>
          <PopoverDescription>Test popover description</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
      </Container>
  </>)
}
