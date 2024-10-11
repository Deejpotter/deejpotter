import { ReactElement } from "react";
import Home from "@/components/home/home";
import "@/app/globals.scss";
import { Modal } from "react-bootstrap";

export default function App(): ReactElement {
  return (
    <>
      <Home />;
    </>
  );
}
