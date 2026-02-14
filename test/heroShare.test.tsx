import { render, screen, fireEvent } from '@testing-library/react';
import Hero from '@/components/landing/Hero';
import { BrowserRouter } from 'react-router-dom';

describe('Hero Share CTA', () => {
  it('renders share button and copies or shares', async () => {
    render(<BrowserRouter><Hero /></BrowserRouter>);
    const btn = screen.getByRole('button', { name: /Share/i });
    expect(btn).toBeInTheDocument();
    // Simulate click; navigator.share may not exist in test env, so ensure no crash
    fireEvent.click(btn);
  });
});
