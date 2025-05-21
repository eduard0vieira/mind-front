import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex flex-col items-center text-white">
      <Image src="/Logo.png" alt="Logo do Blog" width={191} height={126} />
      <p className="text-lg mt-2">Inovação ao Seu Alcance.</p>
    </div>
  );
}