import { render, screen, fireEvent } from '@testing-library/react';
import SmartReminders from '@/components/gamification/SmartReminders';
import { vi } from 'vitest';

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: () => {} }),
}));

describe('SmartReminders', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders and toggles', () => {
    render(<SmartReminders />);
    const btn = screen.getByRole('button', { name: /Off|On/ });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    // toggled state should update button text
    expect(btn.textContent).toMatch(/On/);
  });
});
