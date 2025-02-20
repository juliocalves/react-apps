import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientPage from './ClientPage';
import { createReservation, getConfirmedReservations, getPageContent } from '../services/firestore';

// Mock the firestore services
jest.mock('../services/firestore');

describe('ClientPage', () => {
    beforeEach(() => {
        getConfirmedReservations.mockResolvedValue([]);
        getPageContent.mockResolvedValue({
            title: 'Faça uma reserva',
            description: 'Preencha o formulário para fazer uma reserva.',
        });
    });

    test('renders the ClientPage component', async () => {
        render(<ClientPage />);

        expect(screen.getByText('Faça uma reserva')).toBeInTheDocument();
        expect(screen.getByText('Preencha o formulário para fazer uma reserva.')).toBeInTheDocument();
    });

    test('displays error message when required fields are not filled', async () => {
        render(<ClientPage />);

        fireEvent.click(screen.getByText('Reservar'));

        await waitFor(() => {
            expect(screen.getByText('Por favor, preencha todos os campos obrigatórios.')).toBeInTheDocument();
        });
    });

    test('displays error message when dates are not selected', async () => {
        render(<ClientPage />);

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Telefone / WhatsApp'), { target: { value: '123456789' } });

        fireEvent.click(screen.getByText('Reservar'));

        await waitFor(() => {
            expect(screen.getByText('Por favor, selecione um período válido.')).toBeInTheDocument();
        });
    });

    test('submits the form successfully', async () => {
        createReservation.mockResolvedValueOnce();

        render(<ClientPage />);

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Telefone / WhatsApp'), { target: { value: '123456789' } });

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Telefone / WhatsApp'), { target: { value: '123456789' } });

        fireEvent.click(screen.getByText('Reservar'));

        await waitFor(() => {
            expect(screen.getByText('Reserva realizada com sucesso!')).toBeInTheDocument();
        });
    });

    test('displays error message when reservation creation fails', async () => {
        createReservation.mockRejectedValueOnce(new Error('Erro ao criar reserva'));

        render(<ClientPage />);

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Telefone / WhatsApp'), { target: { value: '123456789' } });

        fireEvent.click(screen.getByText('Reservar'));

        await waitFor(() => {
            expect(screen.getByText('Ocorreu um erro ao criar sua reserva. Tente novamente.')).toBeInTheDocument();
        });
    });
});