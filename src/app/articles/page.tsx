'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

// Tipos dos dados vindos da API
type RawArticle = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  author: { name: string };
  createdAt: string;
};

// Tipos tratados para exibição
type Article = {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  image: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('http://localhost:8000/articles/get');
        if (!res.ok) throw new Error('Erro ao buscar artigos');

        const data: RawArticle[] = await res.json();

        const formattedArticles: Article[] = data.map(article => ({
          id: article.id,
          title: article.title,
          subtitle: article.content.slice(0, 100) + (article.content.length > 100 ? '...' : ''),
          date: new Date(article.createdAt).toLocaleDateString('pt-BR'),
          author: article.author.name,
          image: article.image ?? '/images/user.png',
        }));

        setArticles(formattedArticles);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Erro ao carregar artigos');
          console.error(error);
        } else {
          toast.error('Erro ao carregar artigos');
        }
      }
    }

    fetchArticles();
  }, []);

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Todos os Artigos</h1>

        {articles.length === 0 ? (
          <p className="text-gray-600">Nenhum artigo disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div
                key={article.id}
                className="border rounded-md p-4 shadow-sm hover:shadow-md transition"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h2 className="text-xl font-semibold mt-4">{article.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Por {article.author} — {article.date}
                </p>
                <p className="mt-2 text-gray-700">{article.subtitle}</p>
                <button
                  onClick={() => router.push(`/articles/${article.id}`)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Ler Mais
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
