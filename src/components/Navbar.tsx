import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center max-w-6xl mx-auto px-4 py-4 border-b">
      <div className="text-3xl font-bold">
        <Image src="/LogoMin.png" alt='Logo versão preta em miniatura' width={50} height={50} />
      </div>
      <nav className="flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/artigos">Artigos</Link>
        <span className="text-gray-400">|</span>
        <Link href="/login">Entrar</Link>
        <Link href="/register" className="bg-black text-white px-4 py-2 rounded-md">Registrar</Link>
      </nav>
    </header>
  );
}
