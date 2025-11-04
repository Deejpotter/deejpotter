import { ReactElement } from "react";
import Link from "next/link";

export default function About(props: any): ReactElement {
  return (
    <div className="container py-2">
      <div className="row">
        <div className="col-12 mb-4">
          <h1>About Me</h1>
          <p className="lead">
            I&apos;m married with 3 kids and they&apos;re all my favourite
            people in the world, but my original love was technology. I have
            always loved the dynamic problem solving that working with tech
            requires.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <h2>
            <span className="bi bi-briefcase me-2"></span>My Journey
          </h2>
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
      </div>

      <div className="row">
        <div className="col-12 col-md-6 p-1">
          <h2>
            <span className="bi bi-cpu me-2"></span>My Passion for Technology
          </h2>
          <p>
            From a young age, I was interested in learning about all kinds of
            electronic devices. I grew up with the internet and have spent a lot
            of time learning about how it works. I enjoy sharing my knowledge
            with others and am happy to help when I can, especially if it allows
            me to practice my skills.
          </p>
          <p>
            I&apos;m passionate about AI and machine learning, and I want to
            learn about everything - from global food and education equality to
            environmental sustainability.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <h2>
            <span className="bi bi-journal-bookmark me-2"></span>A Love of
            Learning
          </h2>
          <p>
            I first completed a certificate in IT in 2013, but much of what I
            know about web design has been self-taught. The rules and practices
            in web design are constantly changing, so it&apos;s important for a
            good web developer to be constantly learning and adapting. I have
            also used online courses, such as LinkedIn Learning, to learn about
            business, technology, and design.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <h2>
            <span className="bi bi-heart me-2"></span>The Importance of Family
          </h2>
          <p>
            My family is very important to me. I am married and have three
            children. If I have any free time, I enjoy making and playing video
            games, as well as learning about science and philosophy.
          </p>
          <p>
            Most of the time when I&apos;m not working, I&apos;m studying to
            improve my skills as a web developer because there is always more to
            learn.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <h2>
            <span className="bi bi-hand-thumbs-up me-2"></span>Helping Others
          </h2>
          <p>
            If you have any other questions about me, don&apos;t hesitate to
            reach out. I&apos;d be happy to answer them. Just click the button
            below to contact me.
          </p>
          <Link className="btn btn-primary" href="/contact">
            Contact me
          </Link>
        </div>
      </div>
    </div>
  );
}
