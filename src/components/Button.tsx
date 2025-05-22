interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="w-full bg-black text-white py-2 rounded-2xl hover:opacity-90 transition cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}
