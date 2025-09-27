import { MdDragIndicator } from "react-icons/md";

export default function LessonComponentContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="size-full flex flex-col md:border border-default-color bg-secondary md:rounded-xl overflow-hidden">
      <span className="w-full hidden md:flex items-center gap-2 py-1.5 px-2 group">
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#ff5f57]" />
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#febc2e]" />
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#27c840]" />
        <MdDragIndicator className="ml-auto hidden group-hover:block" />
      </span>
      <div
        className={`size-full border-default-color overflow-hidden rounded-t-xl min-w-0 w-full max-w-full ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
