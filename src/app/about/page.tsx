import { ReactElement } from "react";
import Link from "next/link";

export default function About(props: any): ReactElement {
  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">About Me</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          I&apos;m married with 3 kids and they&apos;re all my favourite people in the
          world, but my original love was technology. I have always loved the
          dynamic problem solving that working with tech requires.
        </p>
      </section>

      <section className="mb-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 flex items-center">
          <i className="bi bi-briefcase mr-3"></i>My Journey
        </h2>
        <div className="space-y-4 text-gray-800 dark:text-gray-300">
          <p>
            When I was younger, I worked at my parents&apos; small family
            restaurant and followed a career as a chef, but I was never
            passionate about it. After completing a Certificate in IT in 2013, I
            realized I had found my calling.
          </p>
          <p>
            I discovered I have an <strong>INTP personality type</strong>, which
            lends itself better to researching and problem-solving than the
            personal skills required by hospitality. Although working as a chef
            forced me to develop skills I wasn&apos;t initially comfortable with
            - clear communication, teamwork, leadership, and stress management -
            skills that now complement my technical abilities.
          </p>
          <p>
            I transitioned to technology by starting my own web design business,
            <strong>Deej Potter Designs</strong>, where I provided end-to-end
            website development from ideation to deployment. Later, I worked as
            a <strong>Junior Full-Stack Developer at One Alpha Tech</strong> in
            Melbourne, working on an airport slot coordination application using
            .NET Core and Angular with Azure/Kubernetes hosting.
          </p>
          <p>
            Currently, I&apos;m working at <strong>Maker Store</strong> while
            studying
            <strong>
              {" "}
              Software Development part-time at Torrens University
            </strong>
            , specializing in AI and Data Science.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-cpu mr-3"></i>My Passion for Technology
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              From a young age, I was interested in learning about all kinds of
              electronic devices. I grew up with the internet and have spent a
              lot of time learning about how it works. I enjoy sharing my
              knowledge with others and am happy to help when I can, especially
              if it allows me to practice my skills.
            </p>
            <p>
              I&apos;m passionate about AI and machine learning, and I want to
              learn about everything - from global food and education equality
              to environmental sustainability.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-journal-bookmark mr-3"></i>A Love of Learning
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              I first completed a certificate in IT in 2013, but much of what I
              know about web design has been self-taught. The rules and
              practices in web design are constantly changing, so it&apos;s
              important for a good web developer to be constantly learning and
              adapting. I have also used online courses, such as LinkedIn
              Learning, to learn about business, technology, and design.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-heart mr-3"></i>The Importance of Family
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              My family is very important to me. I am married and have three
              children. If I have any free time, I enjoy making and playing
              video games, as well as learning about science and philosophy.
            </p>
            <p>
              Most of the time when I&apos;m not working, I&apos;m studying to
              improve my skills as a web developer because there is always more
              to learn.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="bi bi-hand-thumbs-up mr-3"></i>Helping Others
          </h2>
          <div className="space-y-4 text-gray-800 dark:text-gray-300">
            <p>
              If you have any other questions about me, don&apos;t hesitate to
              reach out. I&apos;d be happy to answer them. Just click the button
              below to contact me.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
            >
              Contact me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
