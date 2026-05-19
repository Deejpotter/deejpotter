"use client";

/**
 * AdminSettings — Settings page for managing Stripe test/live mode,
 * viewing configuration status, and accessing the materials config.
 */

interface AdminSettingsProps {
  isTestMode: boolean;
  isConfigured: boolean;
  hasWebhook: boolean;
  baseUrl: string;
  materialsConfig: string;
}

export default function AdminSettings({ isTestMode, isConfigured, hasWebhook, baseUrl, materialsConfig }: AdminSettingsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Payment mode, webhook status, and configuration info.</p>
      </div>

      <div className="space-y-6">
        {/* Payment mode */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Payment mode</h2>
          {!isConfigured ? (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-4">
              <p className="font-medium text-red-800 dark:text-red-200">Stripe not configured</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Set <code className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-xs">STRIPE_SECRET_KEY</code> in your environment variables.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/60 p-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isTestMode ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200" : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"}`}>
                  {isTestMode ? "🧪 Test mode" : "🔴 Live mode"}
                </span>
                <span className="text-sm text-green-800 dark:text-green-200">
                  Stripe is configured and active
                </span>
              </div>
            </div>
          )}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p><strong>How to switch modes:</strong> Change the <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">STRIPE_SECRET_KEY</code> env var between your test key (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">sk_test_...</code>) and live key (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">sk_live_...</code>). Restart the server after changing.</p>
            <p>The webhook endpoint URL is the same for both modes. Stripe determines mode from the key.</p>
          </div>
        </section>

        {/* Webhook status */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Webhook</h2>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${hasWebhook ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                {hasWebhook ? "✅ Configured" : "⚠️ Not configured"}
              </span>
              {hasWebhook && <span className="text-xs text-gray-500">Webhook signature verification enabled</span>}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p><strong>Endpoint URL:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">{baseUrl}/api/webhooks/stripe</code></p>
              <p><strong>Add to Stripe Dashboard:</strong> Go to <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noreferrer" className="text-primary hover:underline">Stripe Webhooks →</a> and add this URL listening for <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">checkout.session.completed</code> and <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">checkout.session.expired</code> events.</p>
              <p>Copy the signing secret and set <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">STRIPE_WEBHOOK_SECRET</code> in your env.</p>
            </div>
          </div>
        </section>

        {/* Materials config */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Materials configuration</h2>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p><strong>Config file:</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">{materialsConfig}</code></p>
              <p>Edit this JSON file to add, remove, or adjust material pricing. No code changes needed.</p>
              <p className="mt-2">Each material has: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">id</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">ratePerGram</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">density_g_per_cm3</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">colors</code>, and <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">suggested</code> flag.</p>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Site configuration</h2>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4">
            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Base URL</dt>
                <dd><code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">{baseUrl}</code></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Clerk auth</dt>
                <dd className="text-green-600">✅ Active</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Admin role check</dt>
                <dd className="text-green-600">✅ Active (middleware)</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
