import React from 'react';
import Navbar from './Navbar';
import { NavbarProvider } from '../../contexts/NavbarContext';
import { AuthContext } from '../ui/auth/AuthProvider';

const mockAuth = {
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isLoaded: true,
  isSignedIn: false,
};

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  decorators: [
    (Story: any) => (
      <AuthContext.Provider value={mockAuth}>
        <NavbarProvider>
          <div className="p-4 bg-white">
            <Story />
          </div>
        </NavbarProvider>
      </AuthContext.Provider>
    ),
  ],
};

export default meta;

export const Default = () => <Navbar />;

export const MobileOpen = () => (
  <div className="lg:hidden">
    <Navbar />
  </div>
);

export const CSSCheck = () => (
  <div className="p-4">
    <div className="bg-gray-800 text-white p-3 rounded">Navbar CSS check — bg-gray-800</div>
  </div>
);
