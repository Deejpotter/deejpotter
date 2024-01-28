import {ReactElement} from "react";
import GradientHeroSection from "@/templates/GradientHeroSection/GradientHeroSection";
import BasicSection from "@/templates/BasicSection/BasicSection";
import Modal from "@/components/Modal";
import { Popover, PopoverContent, PopoverTrigger, PopoverHeading, PopoverDescription, PopoverClose } from "@/components/Popover"

export default function Home(): ReactElement {
  return (<>
    <GradientHeroSection title="Deej Potter" subtitle="A pretty good developer." gradientFrom="primary" gradientTo="light" textColour={"dark"}/>
    <BasicSection heading="Basic section heading" paragraph="Basic section paragraph."/>
    <Modal />
    <Popover>
        <PopoverTrigger>My trigger</PopoverTrigger>
        <PopoverContent className="Popover bg-primary">
          <PopoverHeading>My popover heading</PopoverHeading>
          <PopoverDescription>My popover description</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
  </>)
}
