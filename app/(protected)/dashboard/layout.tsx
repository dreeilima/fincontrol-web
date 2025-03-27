import { Providers } from "@/components/providers";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <Providers>{children}</Providers>;
}
