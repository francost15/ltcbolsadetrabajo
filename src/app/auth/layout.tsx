export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="relative p-8 w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl">
        {children}
      </div>
    </div>
  );
}
