import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StockItemsTable from "../app/projects/tools/20-series-cut-calculator/StockItemsTable";

test("adds and removes stock items", async () => {
  const user = userEvent.setup();

  function Harness() {
    const [items, setItems] = useState([{ id: "1", length: 3050, quantity: 10 }]);

    return (
      <StockItemsTable
        stockItems={items}
        onStockItemsChange={setItems}
        maxStockLength={6100}
      />
    );
  }

  render(<Harness />);

  expect(screen.getByText(/Available Stock/i)).toBeInTheDocument();
  expect(screen.getByLabelText("Length for stock 1")).toHaveValue(3050);
  expect(screen.getByLabelText("Quantity for stock 1")).toHaveValue(10);

  await user.click(screen.getByRole("button", { name: /add new stock item/i }));

  expect(screen.getByLabelText("Length for stock 2")).toHaveValue(6100);
  expect(screen.getByLabelText("Quantity for stock 2")).toHaveValue(10);
  expect(screen.getByRole("button", { name: /remove stock 1/i })).not.toBeDisabled();

  await user.click(screen.getByRole("button", { name: /remove stock 2/i }));

  expect(screen.queryByLabelText("Length for stock 2")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /remove stock 1/i })).toBeDisabled();
});
