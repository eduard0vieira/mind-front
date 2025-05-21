import Logo from './Logo';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen flex overflow-hidden">
      {/* esquerda */}
      <div className="bg-black flex items-center justify-center w-[887px] h-full">
        <Logo />
      </div>

      {/* direita */}
      <div className="flex items-center justify-center flex-1 bg-white text-black px-8 h-full">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </div>
    </main>
  );
}
