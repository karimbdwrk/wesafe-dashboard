import { CompanyGuard } from "@/components/guards/company-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CompanyGuard>{children}</CompanyGuard>;
}
