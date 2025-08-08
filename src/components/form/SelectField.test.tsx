import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import SelectField from "./SelectField";
const mockRegister = {
  name: "test-select",
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ref: jest.fn(),
};

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
];

describe("SelectField", () => {
  it("renders select with provided options", () => {
    render(
      <SelectField
        id="test-select"
        register={mockRegister}
        options={options}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    const optionElements = screen.getAllByRole("option");
    expect(optionElements).toHaveLength(2);
  });

  it("applies error styling when error prop is provided", () => {
    render(
      <SelectField
        id="test-select"
        register={mockRegister}
        options={options}
        error="Required"
      />
    );
    const select = screen.getByRole("combobox");
    expect(select.className).toMatch(/border-red-500/);
  });

  it("applies custom className", () => {
    render(
      <SelectField
        id="test-select"
        register={mockRegister}
        options={options}
        className="custom-class"
      />
    );
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("custom-class");
  });
});
