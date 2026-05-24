import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RevealCard } from './RevealCard';

describe('RevealCard', () => {
  it('announces city-themed groups instead of travel', () => {
    render(<RevealCard name="Alice" city="Lisbon" onReset={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Alice is in Group Lisbon' })).toBeInTheDocument();
    expect(screen.queryByText(/going to/i)).not.toBeInTheDocument();
  });
});
