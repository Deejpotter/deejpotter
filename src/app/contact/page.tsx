import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Deej Potter | Websites, tools, and practical digital work",
  description:
    "Send a written project brief to Deej Potter. Best for website design, redesigns, custom tools, and practical technical work.",
};

export default function ContactPage() {
  return <ContactForm />;
}
