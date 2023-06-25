import {render} from "@testing-library/react";
import NavDropdown from "@/partials/NavDropdown/NavDropdown";

describe("NavDropdown component", () => {

  test("renders with label", () => {
    render(<NavDropdown
      btnLabel="Test"
      indexHref={"/test"}
      navLinks={[
        {href: "/test", label: "Test 1"},
        {href: "/test/test2", label: "Test 2"},
      ]}/>);

  })
})
