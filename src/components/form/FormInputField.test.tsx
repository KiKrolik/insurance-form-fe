import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormInputField from './FormInputField';
import type { FieldError } from 'react-hook-form';

describe('InputField Component', () => {
  it('renders the input field with the correct label', () => {
    render(
      <FormInputField
        id="test-input"
        type="text"
        label="Test Label"
        register={{ name: 'test-input', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }}
      />
    );

    // Check if the label is rendered
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();

    // Check if the input field is rendered
    expect(screen.getByRole('textbox', { name: 'Test Label' })).toBeInTheDocument();
  });

  it('applies error styles when an error is present', () => {
    const error: FieldError = { type: 'required', message: 'This field is required' };

    render(
      <FormInputField
        id="test-input"
        type="text"
        label="Test Label"
        register={{ name: 'test-input', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }}
        error={error}
      />
    );

    // Check if the input field has the error class
    const input = screen.getByRole('textbox', { name: 'Test Label' });
    expect(input).toHaveClass('border-red-500');

    // Check if the error message is displayed
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not display error message when no error is present', () => {
    render(
      <FormInputField
        id="test-input"
        type="text"
        label="Test Label"
        register={{ name: 'test-input', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }}
      />
    );

    // Check that no error message is displayed
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });
});