
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from './Form';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../hooks/useInsuranceCalculator', () => () => ({
  estimatedCost: 1234,
  handleEstimateCost: jest.fn(),
}));

jest.mock('../api/utils', () => ({
  getApiUrl: jest.fn(() => 'http://localhost:8080'),
}));

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all input fields and submit button', () => {
    render(<Form />);
    expect(screen.getByLabelText(/Type of Insurance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Coverage Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Policy Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Policy Duration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calculate with discounts/i })).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<Form />);
    fireEvent.click(screen.getByRole('button', { name: /Calculate with discounts/i }));
    expect(await screen.findByText(/Insurance Type is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Coverage Amount is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Policy Start Date is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Policy Duration is required/i)).toBeInTheDocument();
  });

  test('submits form and displays calculated cost', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { value: 5678 } });
    render(<Form />);
    fireEvent.change(screen.getByLabelText(/Type of Insurance/i), { target: { value: 'auto' } });
    fireEvent.change(screen.getByLabelText(/Coverage Amount/i), { target: { value: 2000 } });
    fireEvent.change(screen.getByLabelText(/Policy Start Date/i), { target: { value: '2024-06-01' } });
    fireEvent.change(screen.getByLabelText(/Policy Duration/i), { target: { value: 2 } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate with discounts/i }));
    await waitFor(() => expect(screen.getByText(/Calculated Cost: \$5678/i)).toBeInTheDocument());
  });

  test('shows error message on API error', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'API error occurred' } }
    });
    render(<Form />);
    fireEvent.change(screen.getByLabelText(/Type of Insurance/i), { target: { value: 'auto' } });
    fireEvent.change(screen.getByLabelText(/Coverage Amount/i), { target: { value: 2000 } });
    fireEvent.change(screen.getByLabelText(/Policy Start Date/i), { target: { value: '2024-06-01' } });
    fireEvent.change(screen.getByLabelText(/Policy Duration/i), { target: { value: 2 } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate with discounts/i }));
    await waitFor(() => expect(screen.getByText(/API error occurred/i)).toBeInTheDocument());
  });
});