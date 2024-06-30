import DashNavbar from "@/components/DashNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashNavbar />
      {children}
    </>
  );
}
