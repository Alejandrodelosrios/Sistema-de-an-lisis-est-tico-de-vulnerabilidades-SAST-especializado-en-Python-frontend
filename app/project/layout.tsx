export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="text-slate-100">
        {children}
      </div>
    </div>
  );
}
