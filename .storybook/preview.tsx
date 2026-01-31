import React from 'react';
import type { Preview } from '@storybook/nextjs-vite';
import '../src/styles/globals.css';
import { NavbarProvider } from '../src/contexts/NavbarContext';
import { AuthContext } from '../src/components/ui/auth/AuthProvider';

const mockAuth = {
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isLoaded: true,
  isSignedIn: false,
};

class StoryErrorBoundary extends React.Component<any, {error: Error | null}>
{
  constructor(props:any){
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error){
    return { error };
  }
  componentDidCatch(error: Error, info: any){
    console.error('Story render error:', error, info);
  }
  render(){
    if(this.state.error){
      return (
        <div style={{padding:20}}>
          <h2 style={{color:'red'}}>Error rendering story</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const withProviders = (Story: any) => (
  <AuthContext.Provider value={mockAuth}>
    <NavbarProvider>
      <StoryErrorBoundary>
        <div className="min-h-screen bg-white">
          <Story />
        </div>
      </StoryErrorBoundary>
    </NavbarProvider>
  </AuthContext.Provider>
);

const TailwindChecker = () => {
  React.useEffect(() => {
    try{
      const hasPrimary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      console.log('Tailwind check: --color-primary=', hasPrimary.trim(), 'bodyBg=', bodyBg);
    }catch(e){
      console.warn('Tailwind check failed', e);
    }
  }, []);
  return null;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [TailwindChecker, withProviders],
};

export default preview;
