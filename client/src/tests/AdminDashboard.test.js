import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { auth } from '../firebase/auth';

jest.mock('../firebase/auth', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));

describe('AdminDashboard', () => {
  it('renders without crashing', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('fetches the user id when user logs in', async () => {
    auth.onAuthStateChanged.mockImplementationOnce((cb) => cb({ uid: '1234' }));
    await act(async () => render(<AdminDashboard />));
    expect(screen.getByText('1234')).toBeInTheDocument();
  });
});
