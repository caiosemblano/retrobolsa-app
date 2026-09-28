import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        toastOptions={{
          style: { borderRadius: '14px' },
        }}
      />
    </AuthProvider>
  );
}
