import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AboutPage from './AboutPage';
import { getPageContent } from '../services/firestore';


// Mock the getPageContent function
jest.mock('../services/firestore', () => ({
    getPageContent: jest.fn(),
}));

// Mock the PublicLayout component
jest.mock('../layouts/PublicLayout', () => ({ children }) => <div>{children}</div>);

describe('AboutPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading message when images are not available', async () => {
        getPageContent.mockResolvedValueOnce({
            title: 'About Us',
            description: 'This is the about page description.',
            history: 'Our history.',
            mission: 'Our mission.',
            images: [],
        });

        render(<AboutPage />);

        expect(screen.getByText('Carregando imagens...')).toBeInTheDocument();
        await waitFor(() => expect(getPageContent).toHaveBeenCalledTimes(1));
    });

    test('renders title and description correctly', async () => {
        getPageContent.mockResolvedValueOnce({
            title: 'About Us',
            description: 'This is the about page description.',
            history: 'Our history.',
            mission: 'Our mission.',
            images: [],
        });

        render(<AboutPage />);

        await waitFor(() => expect(getPageContent).toHaveBeenCalledTimes(1));
        expect(screen.getByText('About Us')).toBeInTheDocument();
        expect(screen.getByText('This is the about page description.')).toBeInTheDocument();
    });

    test('renders carousel with images when available', async () => {
        const images = ['image1.jpg', 'image2.jpg'];
        getPageContent.mockResolvedValueOnce({
            title: 'About Us',
            description: 'This is the about page description.',
            history: 'Our history.',
            mission: 'Our mission.',
            images,
        });

        render(<AboutPage />);

        await waitFor(() => expect(getPageContent).toHaveBeenCalledTimes(1));
        expect(screen.getByRole('img', { name: 'Imagem 1' })).toHaveAttribute('src', 'image1.jpg');
        expect(screen.getByRole('img', { name: 'Imagem 2' })).toHaveAttribute('src', 'image2.jpg');
    });

    test('renders default title and description when content is empty', async () => {
        getPageContent.mockResolvedValueOnce(null);

        render(<AboutPage />);

        await waitFor(() => expect(getPageContent).toHaveBeenCalledTimes(1));
        expect(screen.getByText('Sobre Nós')).toBeInTheDocument();
        expect(screen.getByText('Conheça mais sobre nossa história e missão.')).toBeInTheDocument();
    });
});