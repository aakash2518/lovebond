import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: February 6, 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to LoveBond. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you use our app 
                and tell you about your privacy rights.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Account Information:</strong> Name, email address, profile photo</li>
                <li><strong>Relationship Data:</strong> Partner connection, relationship start date, milestones</li>
                <li><strong>Location Data:</strong> Real-time location (only when shared with partner)</li>
                <li><strong>Messages & Photos:</strong> Chat messages, shared photos, and media</li>
                <li><strong>Usage Data:</strong> App interactions, features used, login times</li>
                <li><strong>Device Information:</strong> Device type, OS version, app version</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>To provide and maintain our service</li>
                <li>To connect you with your partner</li>
                <li>To enable real-time messaging and location sharing</li>
                <li>To send notifications about partner activities</li>
                <li>To improve and personalize your experience</li>
                <li>To process subscription payments</li>
                <li>To provide customer support</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Storage & Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We use Firebase (Google Cloud) to store your data securely. Your data is:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Encrypted in transit using HTTPS/TLS</li>
                <li>Stored in secure, access-controlled databases</li>
                <li>Protected by Firebase security rules</li>
                <li>Backed up regularly to prevent data loss</li>
                <li>Only accessible to you and your connected partner</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Sharing
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We do NOT sell your personal data. Your data is only shared:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>With Your Partner:</strong> When you connect as a couple</li>
                <li><strong>Service Providers:</strong> Firebase (Google), payment processors</li>
                <li><strong>Legal Requirements:</strong> If required by law or to protect rights</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Your Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt-out of notifications</li>
                <li>Withdraw consent for location sharing</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Children's Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                LoveBond is not intended for users under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="space-y-1 ml-4 mt-2 text-gray-700 dark:text-gray-300">
                <li><strong>Website:</strong> https://lovebond.vercel.app</li>
                <li><strong>GitHub:</strong> https://github.com/aakash2518/lovebond</li>
              </ul>
            </section>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                By using LoveBond, you agree to this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
