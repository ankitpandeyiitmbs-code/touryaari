import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import '@/styles/globals.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SettingsProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1B3A2D',
              color: '#fff',
              padding: '16px',
              borderRadius: '4px',
            },
            success: {
              iconTheme: {
                primary: '#C89033',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#E8B055',
                secondary: '#fff',
              },
            },
          }}
        />
      </SettingsProvider>
    </div>
  );
}
