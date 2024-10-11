import { ReactElement } from "react";
import Link from "next/link";

export default function About(props: any): ReactElement {
  return (
    <div className="container py-2">
      <div className="row">
        <div className="col-12">
          <h1>Things I love:</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6 p-1">
          <h2>
            <span className="bi bi-cpu me-2"></span>My Passion for Technology
          </h2>
          <p>
            I have always had a love for technology. From a young age, I was
            interested in learning about all kinds of electronic devices. I grew
            up with the internet and have spent a lot of time learning about how
            it works. I enjoy sharing my knowledge with others and am happy to
            help when I can, especially if it allows me to practice my skills.
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
