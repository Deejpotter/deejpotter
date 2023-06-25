import {ReactElement} from "react";
import {Project} from "@/types/Project";

export default function Fun(props: any): ReactElement {
  let projects: Project[] = [{
    name: "Todo list", description: "A todo list app that I made with React and TypeScript. It uses local storage to save the todos."
  }];

  return (<>
    <h1>Fun</h1>
    <p>These are some fun things that I&apos;ve made!</p>
    <ul>
      {projects.map((project: Project) => {
        return (<li key={project.name}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </li>)
      })}
    </ul>
  </>)
}
