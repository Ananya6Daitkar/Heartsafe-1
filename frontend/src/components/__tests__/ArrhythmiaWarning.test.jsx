import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ArrhythmiaWarning } from '../ArrhythmiaWarning';
import { useECGStore } from '../../hooks/useStore';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

describe('ArrhythmiaWarning', () => {
  beforeEach(() => {
    useECGStore.setState({ showArrhythmiaWarning: false });
  });

  it('renders warning when showArrhythmiaWarning is true', () => {
    useECGStore.setState({ showArrhythmiaWarning: true });
    render(<ArrhythmiaWarning />);
    expect(screen.getByText(/Arrhythmia Detected/)).toBeInTheDocument();
  });

  it('does not render warning when showArrhythmiaWarning is false', () => {
    useECGStore.setState({ showArrhythmiaWarning: false });
    render(<ArrhythmiaWarning />);
    expect(screen.queryByText(/Arrhythmia Detected/)).not.toBeInTheDocument();
  });

  it('displays warning icon', () => {
    useECGStore.setState({ showArrhythmiaWarning: true });
    render(<ArrhythmiaWarning />);
    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
  });
});
