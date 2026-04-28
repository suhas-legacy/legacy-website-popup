<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Legacy Global Bank Next.js App Router project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with a reverse proxy through `/ingest` rewrites in `next.config.mjs`. A server-side PostHog singleton is available in `lib/posthog-server.ts` for future API route usage. Eight events are tracked across six files, covering the full user journey from market exploration through demo signup and account opening to contact lead submission and platform downloads. Error tracking is enabled globally via `capture_exceptions: true`.

| Event | Description | File |
|-------|-------------|------|
| `open_account_clicked` | User clicks "Open Account" CTA button (with `account_type`: standard, classic, pro, vip) | `components/AccountTypes.tsx` |
| `demo_account_cta_clicked` | User clicks "Try Demo Account Free" on the demo page | `components/DemoCta.tsx` (used in `app/demo/page.tsx`) |
| `contact_form_submitted` | Contact form successfully submitted — lead generated (with `connect_type`, `priority`, `city`) | `components/ContactForm.tsx` |
| `contact_form_error` | Contact form submission failed — network or server error (with `error_message`, `connect_type`) | `components/ContactForm.tsx` |
| `platform_download_clicked` | User clicks to download/open a trading platform (with `platform`, `platform_name`) | `components/Downloads.tsx` |
| `market_chart_opened` | User opens a live TradingView chart by clicking a market card (with `symbol`, `chart_title`) | `components/MarketView.tsx` |
| `market_tab_switched` | User switches market category tab — All, Forex, Commodities, Indexes (with `tab`) | `components/MarketView.tsx` |
| `calculator_used` | User first interacts with the pip calculator widget (with `calculator_type`) | `components/PipCalculator.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/399577/dashboard/1518841
- **Account Signup Funnel** (Demo CTA → Open Account): https://us.posthog.com/project/399577/insights/tQtm2C0H
- **Open Account Clicks by Account Type**: https://us.posthog.com/project/399577/insights/XONMsWOD
- **Platform Downloads by Platform**: https://us.posthog.com/project/399577/insights/zPq2L7O4
- **Contact Form Leads Over Time**: https://us.posthog.com/project/399577/insights/WKfSO5KV
- **Top Traded Instruments (Chart Opens)**: https://us.posthog.com/project/399577/insights/Edeeeehd

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
