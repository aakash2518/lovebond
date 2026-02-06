import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: February 6, 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using LoveBond, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our app.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                2. Description of Service
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                LoveBond is a relationship app that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Real-time messaging between couples</li>
                <li>Location sharing features</li>
                <li>Photo and media sharing</li>
                <li>Relationship tracking and milestones</li>
                <li>Interactive games and activities</li>
                <li>Premium subscription features</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                3. User Eligibility
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>You must be at least 13 years old to use LoveBond</li>
                <li>You must provide accurate registration information</li>
                <li>You are responsible for maintaining account security</li>
                <li>One account per person</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                4. User Conduct
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Use the app for illegal purposes</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload inappropriate or offensive content</li>
                <li>Impersonate others or create fake accounts</li>
                <li>Attempt to hack or compromise the app</li>
                <li>Share copyrighted material without permission</li>
                <li>Spam or send unsolicited messages</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                5. Premium Subscription
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Premium features require a paid subscription (₹199/month)</li>
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>Refunds are subject to our refund policy</li>
                <li>We may change pricing with 30 days notice</li>
                <li>Premium features may change over time</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                6. Content Ownership
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>You retain ownership of content you upload</li>
                <li>You grant us license to store and display your content</li>
                <li>We may remove content that violates these terms</li>
                <li>You are responsible for backing up your content</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                7. Privacy & Data
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your use of LoveBond is also governed by our{" "}
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Privacy Policy
                </button>
                . Please review it to understand how we collect and use your data.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                8. Termination
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>You may delete your account at any time</li>
                <li>We may suspend or terminate accounts that violate these terms</li>
                <li>Upon termination, your data will be deleted per our Privacy Policy</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                9. Disclaimers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy of information</li>
                <li>Security of data transmission</li>
                <li>Compatibility with all devices</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                10. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                LoveBond shall not be liable for any indirect, incidental, special, or consequential damages 
                arising from your use of the app.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                11. Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update these Terms of Service from time to time. Continued use of the app after 
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                12. Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These terms are governed by the laws of India. Any disputes shall be resolved in Indian courts.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                13. Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                For questions about these Terms of Service:
              </p>
              <ul className="space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                <li><strong>Website:</strong> https://lovebond.vercel.app</li>
                <li><strong>GitHub:</strong> https://github.com/aakash2518/lovebond</li>
              </ul>
            </section>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                By using LoveBond, you acknowledge that you have read and agree to these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
