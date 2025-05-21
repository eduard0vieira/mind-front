import Logo from './Logo';

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
      </div>
    </main>
  );
}
