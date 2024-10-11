import { ReactElement } from "react";

export default function BasicSection(props: any): ReactElement {
  return (
    <section
      className={`bg-${props.backgroundColour} text-${props.textColour} py-5`}
    >
      <div className="container">
        <h2>{props.heading}</h2>
        <p>{props.paragraph}</p>
      </div>
    </section>
  );
}
