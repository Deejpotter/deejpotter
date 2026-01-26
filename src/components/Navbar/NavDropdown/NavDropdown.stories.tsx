import React from 'react';
import NavDropdown from './NavDropdown';
import { NavbarProvider } from '../../../contexts/NavbarContext';
import { AuthContext } from '../../ui/auth/AuthProvider';

const mockAuth = {
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isLoaded: true,
  isSignedIn: false,
};

const meta = {
  title: 'Components/Navbar/NavDropdown',
  component: NavDropdown,
  decorators: [
    (Story: any) => (
      <AuthContext.Provider value={mockAuth}>
        <NavbarProvider>
          <div className="p-4 bg-white w-64">
            <Story />
          </div>
        </NavbarProvider>
      </AuthContext.Provider>
    ),
  ],
};

export default meta;

export const Default = () => (
  <div className="w-64">
    <NavDropdown label="Projects" items={[{ label: 'Apps' }, { label: 'Websites' }]} />
  </div>
);

export const Open = () => (
  <div className="w-64">
    <NavDropdown label="Projects" items={[{ label: 'Apps' }, { label: 'Websites' }]} />
  </div>
);
