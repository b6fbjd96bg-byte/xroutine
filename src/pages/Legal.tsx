import LegalPage from "./LegalPage";

const UPDATED = "September 30, 2026";
const EMAIL = "support@superoutine.pro";

export const Terms = () => (
  <LegalPage title="Terms and Conditions" path="/terms" description="Read the Superoutine Terms and Conditions covering accounts, subscriptions and payments in USD, acceptable use and liability for the AI habit tracker app." updated={UPDATED} sections={[
    { heading: "1. Acceptance of Terms", body: ["By accessing or using Superoutine, you agree to these Terms and Conditions. If you do not agree, please do not use the service."] },
    { heading: "2. The Service", body: ["Superoutine is a digital habit-tracking platform offering free and premium subscription plans. Features may change over time as we improve the product."] },
    { heading: "3. Accounts", body: ["You are responsible for keeping your login details secure and for all activity under your account. You must provide accurate information when signing up."] },
    { heading: "4. Subscriptions & Payments", body: ["Premium plans are billed in advance through our payment partner. Prices are shown in US dollars (USD). Monthly and yearly plans can be cancelled at any time from Settings."] },
    { heading: "5. Acceptable Use", body: ["You agree not to misuse the service, attempt unauthorized access, or use it for unlawful purposes. We may suspend accounts that violate these terms."] },
    { heading: "6. Limitation of Liability", body: ["Superoutine is provided \"as is\". We are not liable for indirect or consequential losses arising from use of the service. The app is not a substitute for medical advice."] },
    { heading: "7. Governing Law", body: ["These terms are governed by the laws of India. Disputes are subject to the jurisdiction of courts in India."] },
    { heading: "8. Contact", body: [`Questions about these terms? Email us at ${EMAIL}.`] },
  ]} />
);

export const Privacy = () => (
  <LegalPage title="Privacy Policy" path="/privacy" description="How Superoutine collects, uses and guards your data. Each account can only read its own habits and tasks, and passwords are never stored in readable form." updated={UPDATED} sections={[
    { heading: "1. Information We Collect", body: ["We collect your name, email address and the habit, journal and progress data you enter. We also collect basic usage data such as pages visited."] },
    { heading: "2. How We Use It", body: ["Your data is used to provide and improve the service, show your progress, send service emails such as weekly reports, and process payments."] },
    { heading: "3. Payments", body: ["Payments are handled by secure third-party payment providers. We do not store your card or bank details on our servers."] },
    { heading: "4. Data Sharing", body: ["We never sell your personal data. We share data only with trusted service providers needed to run Superoutine, or when required by law."] },
    { heading: "5. Security", body: ["Your data is stored securely with access controls so that only you can see your personal habits and entries."] },
    { heading: "6. Your Rights", body: [`You may request access to, correction of, or deletion of your data at any time by emailing ${EMAIL}.`] },
    { heading: "7. Changes", body: ["We may update this policy from time to time. Changes will be posted on this page."] },
  ]} />
);

export const Shipping = () => (
  <LegalPage title="Shipping Policy" path="/shipping" description="Superoutine is a digital web app, so nothing is shipped. Pro access is delivered instantly to your account after payment. Read the shipping policy." updated={UPDATED} sections={[
    { heading: "Digital Service Only", body: ["Superoutine is a fully digital product. No physical goods are shipped."] },
    { heading: "Delivery of Service", body: ["Premium features are activated on your account instantly after successful payment, usually within a few minutes. Access is available worldwide wherever the website can be reached."] },
    { heading: "Delays", body: [`If your premium access is not activated within 24 hours of payment, contact us at ${EMAIL} with your payment reference and we will resolve it promptly.`] },
  ]} />
);

export const Refunds = () => (
  <LegalPage title="Cancellation and Refunds" path="/refunds" description="How to cancel a Superoutine plan and request a refund. Monthly and yearly plans can be cancelled anytime in Settings; you keep Pro until the period ends." updated={UPDATED} sections={[
    { heading: "Cancellation", body: ["You can cancel your premium subscription at any time. After cancellation, premium access continues until the end of the current billing period and will not renew."] },
    { heading: "Refund Eligibility", body: ["Refund requests made within 7 days of the first purchase are eligible for a full refund. Renewals and requests after 7 days are generally not refundable, except in cases of duplicate or failed-but-charged payments."] },
    { heading: "How to Request", body: [`Email ${EMAIL} with your registered email and payment reference. Approved refunds are processed within 5–7 business days to the original payment method.`] },
  ]} />
);
