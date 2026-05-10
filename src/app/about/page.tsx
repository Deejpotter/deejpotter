import { ReactElement } from "react";
import Link from "next/link";

export default function About(): ReactElement {
  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">About Me</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          I am a website designer and developer with a strong bias toward
          practical problem solving. I like building things that are clear,
          useful, maintainable, and actually help the people using them.
        </p>
      </section>

      <section className="mb-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 flex items-center">
          <i className="bi bi-briefcase mr-3"></i>My Journey
        </h2>
        <div className="space-y-4 text-gray-800 dark:text-gray-300">
          <p>
            My path into tech did not begin in a conventional way. I spent
            years working as a chef in my family&apos;s small restaurant before
            eventually realising that the work I truly cared about was solving
            technical problems and building things on the web.
          </p>
          <p>
            After completing a Certificate in IT, I moved further into software
            and digital work through self-directed learning, client website
            projects, and professional development roles. That shift taught me
            something useful: good work is not just about code quality. It is
            also about communication, constraints, deadlines, and making
            something genuinely workable for real people.
          </p>
          <p>
            I have built websites for clients, worked as a junior full-stack
            developer in a team environment, and continue to work across
            software, operations, and technical systems. That mix is part of why
            I am comfortable moving between design decisions, implementation
            details, and the practical realities behind a project.
          </p>
          <p>
            These days, I am especially interested in website design and
            development, workflow tools, automation, and the kinds of projects
            that sit between software and real-world operations.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-window mr-3"></i>How I work
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              I prefer projects where there is a real need to solve: a site that
              needs to convert better, content that needs clearer structure, a
              workflow that wastes time, or a tool that does not exist yet.
            </p>
            <p>
              My style is practical and iterative. I would rather improve the
              thing properly than hide weak decisions behind marketing language.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-chat-dots mr-3"></i>Communication style
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              I am happy to work through written communication first. Contact
              forms, email, social messaging, and freelance-platform messages
              are all fine ways to begin. That usually makes scope, revisions,
              and expectations easier to keep clear.
            </p>
            <p>
              I do not need to publish phone numbers or physical contact details
              to do good work. A clear written brief is far more useful.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-cpu mr-3"></i>Technical interests
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              I enjoy web development, AI-assisted workflows, automation,
              engineering tools, and the broader systems thinking that connects
              software to operations.
            </p>
            <p>
              I am especially drawn to work where software has to be both
              technically sound and practically useful.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-hand-thumbs-up mr-3"></i>Working together
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              If you need a website, redesign, or a custom digital tool, send me
              a message with the basics of what you are trying to achieve.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
            >
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
