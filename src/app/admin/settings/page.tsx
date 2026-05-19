import type { Metadata } from "next";
import AdminSettings from "./AdminSettings";

export const metadata: Metadata = {
  title: "Settings | Admin",
  robots: { index: false },
};

export default function AdminSettingsPage() {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const materialsConfig = process.env.PRINTING_MATERIALS_CONFIG || "config/printing-materials.json (default)";
  const isTestMode = stripeKey.startsWith("sk_test_");
  const isConfigured = !!stripeKey;
  const hasWebhook = !!webhookSecret;

  return (
    <AdminSettings
      isTestMode={isTestMode}
      isConfigured={isConfigured}
      hasWebhook={hasWebhook}
      baseUrl={baseUrl}
      materialsConfig={materialsConfig}
    />
  );
}
