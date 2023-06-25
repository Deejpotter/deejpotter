import {ReactElement} from "react";

export default function Contact(props: any): ReactElement {
  let formAction: string = "https://deejpotter.com/your-form-action";

  return (<main className="container py-4">
    <div className="row">
      <div className="col-md">
        <h2>Have some questions or feedback for me?</h2>
        <p>Fill in the form with your info and I&apos;ll get back to you as soon as I can. I promise I&apos;ll only use this
          information to contact you about your feedback, I won&apos;t share it with anyone or use it for any other reason.</p>
      </div>
      <div className="col-md">
        <form name="contact" method="post" className="card shadow p-2 bg-secondary text-light" data-netlify="true" netlify-honeypot="bot-field">
          <div className="form-group" hidden>
            <label htmlFor="bot-field">Don&apos;t fill this out if you&apos;re human:</label>
            <input type="text" id="bot-field" name="bot-field"></input>
          </div>
          <input type="hidden" name="form-name" value="contact"></input>
          <div className="form-group pb-2">
            <label htmlFor="message">Enter Message (required):</label>
            <textarea required id="message" className="form-control shadow" name="message"></textarea>
          </div>
          <div className="form-group pb-2">
            <label htmlFor="email">Enter your email address <br></br>(optional - if you want a reply):</label>
            <input type="email" id="email" className="form-control shadow" name="email"></input>
          </div>
          <div className="form-group pb-2">
            <button className="btn btn-info shadow" type="submit">Submit form</button>
          </div>
        </form>
      </div>
    </div>
  </main>)
}
