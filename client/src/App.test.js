import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientPage from './ClientPage';
import { createReservation, getConfirmedReservations } from '../services/firestore';
import DatePicker from 'react-datepicker';

jest.mock('react-datepicker');
jest.mock('../services/firestore');

describe('ClientPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getConfirmedReservations.mockResolvedValue([]); // No blocked dates initially
  });

  it('renders the component', () => {
    render(<ClientPage />);
    expect(screen.getByText('Página do Cliente')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<ClientPage />);

    const nameInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Telefone / WhatsApp');
    const submitButton = screen.getByRole('button', { name: 'Reservar' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    // Mock DatePicker value changes
    DatePicker.mockImplementation(({ onChange }) => {
      return <div onClick={() => onChange([new Date(), new Date()])}>Select Date</div>;
    });
    fireEvent.click(screen.getByText('Select Date'));



    createReservation.mockResolvedValue(); // Mock successful reservation

    fireEvent.click(submitButton);

    expect(createReservation).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
    });

    // Check for success modal (adjust selector as needed)
    expect(await screen.findByText('Reserva realizada com sucesso!')).toBeVisible();

        // Check if form fields are cleared
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(phoneInput.value).toBe('');

  });


  it('displays error message for empty required fields', async () => {
    render(<ClientPage />);
    const submitButton = screen.getByRole('button', { name: 'Reservar' });
    fireEvent.click(submitButton);
    expect(await screen.findByText('Por favor, preencha todos os campos obrigatórios.')).toBeVisible();
  });


  it('displays error message for missing dates', async () => {
    render(<ClientPage />);
    const nameInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Telefone / WhatsApp');
    const submitButton = screen.getByRole('button', { name: 'Reservar' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Por favor, selecione um período válido.')).toBeVisible();

  });

  it('displays error message for reservation creation failure', async () => {
      render(<ClientPage />);

      const nameInput = screen.getByPlaceholderText('Nome');
      const emailInput = screen.getByPlaceholderText('Email');
      const phoneInput = screen.getByPlaceholderText('Telefone / WhatsApp');

       // Mock DatePicker value changes
      DatePicker.mockImplementation(({ onChange }) => {
        return <div onClick={() => onChange([new Date(), new Date()])}>Select Date</div>;
      });
      fireEvent.click(screen.getByText('Select Date'));

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });


      const submitButton = screen.getByRole('button', { name: 'Reservar' });
      createReservation.mockRejectedValue(new Error('Test error')); // Mock error

      fireEvent.click(submitButton);

      expect(await screen.findByText('Ocorreu um erro ao criar sua reserva. Tente novamente.')).toBeVisible();
    });


    it('disables submit button while submitting', async () => {
      render(<ClientPage />);

      const nameInput = screen.getByPlaceholderText('Nome');
      const emailInput = screen.getByPlaceholderText('Email');
      const phoneInput = screen.getByPlaceholderText('Telefone / WhatsApp');
      const submitButton = screen.getByRole('button', { name: 'Reservar' });

       // Mock DatePicker value changes
       DatePicker.mockImplementation(({ onChange }) => {
        return <div onClick={() => onChange([new Date(), new Date()])}>Select Date</div>;
      });
      fireEvent.click(screen.getByText('Select Date'));


      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });

      createReservation.mockResolvedValue();

      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled(); // Check if the button is disabled
      expect(submitButton.textContent).toBe('Enviando...');

      // Wait for the submission to resolve and check if the button is re-enabled
      await createReservation; 
      expect(submitButton).not.toBeDisabled();
      expect(submitButton.textContent).toBe('Reservar');

    });

  it('filters blocked dates correctly', async () => {
    const blockedDate = new Date();
    getConfirmedReservations.mockResolvedValue([blockedDate]);
    render(<ClientPage />);

    // Check if the DatePicker implementation receives the correct filterDate prop
    expect(DatePicker).toHaveBeenCalledWith(
      expect.objectContaining({
        filterDate: expect.any(Function),
      })
    );
  });


});


