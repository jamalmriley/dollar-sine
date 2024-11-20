export default function CourseTile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tile-parent">
      <div className="min-h-6 border-b flex gap-1.5 items-center pl-2">
        <div className="tile-child-1" />
        <div className="tile-child-2" />
        <div className="tile-child-3" />
      </div>
      {children}
    </div>
  );
}
