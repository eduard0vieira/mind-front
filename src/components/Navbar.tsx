'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type UserType = {
  id: number;
  name: string;
  email: string;
  image?: string | null;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoggedIn(true);
    fetch('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Não autenticado');
        return res.json();
      })
      .then((data: UserType) => setUser(data))
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Base da URL atual (http://localhost:3000 ou o que for)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Escolhe a URL da imagem: a do usuário ou o default em public/images/user.png
  const avatarSrc = user?.image
    ? user.image
    : `${origin}/images/user.png`;

  return (
    <header className="font-medium flex justify-between items-center max-w-6xl mx-auto px-4 py-4">
      <div className="text-3xl font-bold">
        <Link href="/">
          <Image
          src="/LogoMin.png"
          alt="Logo versão preta em miniatura"
          width={50}
          height={50}
          />
        </Link>

      </div>

      <nav className="flex items-center gap-6 relative">
        <Link href="/">Home</Link>
        <Link href="/artigos">Artigos</Link>
        <span className="text-gray-400">|</span>

        {!isLoggedIn ? (
          <>
            <Link href="/login">Entrar</Link>
            <Link href="/register" className="bg-black text-white px-4 py-2 rounded-lg">
              Registrar
            </Link>
          </>
        ) : (
          <>
            <Link href="/newArticle" className="text-black hover:text-gray-700">
              Publicar
            </Link>

            {/* Avatar sempre exibido quando logado */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(prev => !prev)}>
                <Image
                  src={avatarSrc}
                  alt="Avatar do usuário"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push('/perfil');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      router.push('/login');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
