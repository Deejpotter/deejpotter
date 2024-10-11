import { ReactElement } from "react";
import { Project } from "@/types/Project";

export default function Apps(): ReactElement {
  const projects: Project[] = [
    {
      name: "Todo list",
      description: "A todo list app that I made with React and TypeScript.",
    },
  ];

  return (
    <>
      <h1>Apps</h1>
      <p>These are some apps that I&apos;ve made!</p>
      <ul>
        {projects.map((project: Project) => {
          return (
            <li key={project.name}>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
