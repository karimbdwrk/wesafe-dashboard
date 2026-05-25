import { SuperAdminGuard } from "@/components/guards/superadmin-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SuperAdminGuard>{children}</SuperAdminGuard>;
}
