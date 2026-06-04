import { Dashboard } from "@/components/dashboard";
import { isNeonAuthConfigured } from "@/lib/auth/server";

export default function DashboardPage() {
  return <Dashboard showUserMenu={isNeonAuthConfigured} />;
}
