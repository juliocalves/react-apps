import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from './ContactPage';
import { createContact, getPageContent } from '../services/firestore';

// Mock the firestore services
jest.mock('../services/firestore');

describe('ContactPage', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.resetAllMocks();
    });

    test('renders contact page with form', async () => {
        getPageContent.mockResolvedValue({
            title: 'Contact Us',
            description: 'Please fill out the form below to get in touch with us.',
        });

        render(<ContactPage />);

        expect(await screen.findByText('Contact Us')).toBeInTheDocument();
        expect(screen.getByText('Please fill out the form below to get in touch with us.')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mensagem')).toBeInTheDocument();
    });

    test('handles form input changes', () => {
        render(<ContactPage />);

        const nameInput = screen.getByPlaceholderText('Nome');
        const emailInput = screen.getByPlaceholderText('Email');
        const messageInput = screen.getByPlaceholderText('Mensagem');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(messageInput, { target: { value: 'Hello, this is a test message.' } });

        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@example.com');
        expect(messageInput.value).toBe('Hello, this is a test message.');
    });

    test('submits the form successfully', async () => {
        createContact.mockResolvedValueOnce();

        render(<ContactPage />);

        const nameInput = screen.getByPlaceholderText('Nome');
        const emailInput = screen.getByPlaceholderText('Email');
        const messageInput = screen.getByPlaceholderText('Mensagem');
        const submitButton = screen.getByText('Enviar Mensagem');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(messageInput, { target: { value: 'Hello, this is a test message.' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createContact).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Hello, this is a test message.',
            });
        });

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Mensagem enviada com sucesso!');
        });

        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
    });

    test('handles form submission error', async () => {
        createContact.mockRejectedValueOnce(new Error('Failed to send message'));

        render(<ContactPage />);

        const nameInput = screen.getByPlaceholderText('Nome');
        const emailInput = screen.getByPlaceholderText('Email');
        const messageInput = screen.getByPlaceholderText('Mensagem');
        const submitButton = screen.getByText('Enviar Mensagem');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(messageInput, { target: { value: 'Hello, this is a test message.' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createContact).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Hello, this is a test message.',
            });
        });

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
        });
    });
});