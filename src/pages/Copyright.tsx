import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Copyright = () => {
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
              Copyright Notice
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              LoveBond - Couple Bonding App
            </p>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <p className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                  Copyright © 2026 LoveBond. All rights reserved.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Intellectual Property Rights
              </h2>
              <p className="leading-relaxed">
                This mobile application and all of its content, features, and functionality 
                (including but not limited to all information, software, text, displays, images, 
                video, and audio, and the design, selection, and arrangement thereof) are owned 
                by LoveBond, its licensors, or other providers of such material and are protected 
                by Indian and international copyright, trademark, patent, trade secret, and other 
                intellectual property or proprietary rights laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                License Terms
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Permitted Use
                  </h3>
                  <p className="mb-2">You are granted a limited, non-exclusive, non-transferable license to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Download and install the LoveBond app on your personal mobile device</li>
                    <li>Use the app for personal, non-commercial purposes</li>
                    <li>Access features according to your subscription tier (Free or Premium)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Prohibited Use
                  </h3>
                  <p className="mb-2">You may NOT:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Copy, modify, or create derivative works of the app</li>
                    <li>Reverse engineer, decompile, or disassemble the app</li>
                    <li>Remove any copyright or proprietary notices</li>
                    <li>Use the app for commercial purposes without permission</li>
                    <li>Distribute, sublicense, or transfer the app to third parties</li>
                    <li>Use the app in any way that violates applicable laws</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Third-Party Content & Services
              </h2>
              <p className="mb-2">This app uses the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Firebase</strong> (Google LLC) - Authentication, Database, Storage</li>
                <li><strong>Vercel</strong> - Web Hosting</li>
                <li><strong>React</strong> - UI Framework (MIT License)</li>
                <li><strong>Radix UI</strong> - UI Components (MIT License)</li>
                <li><strong>Lucide Icons</strong> - Icons (ISC License)</li>
              </ul>
              <p className="mt-2">
                All third-party trademarks, service marks, and logos are the property of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                User-Generated Content
              </h2>
              <p className="mb-2">By uploading photos, messages, or other content to LoveBond:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You retain ownership of your content</li>
                <li>You grant LoveBond a license to store and display your content</li>
                <li>You confirm you have rights to upload the content</li>
                <li>You agree not to upload copyrighted material without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Privacy & Data Protection
              </h2>
              <p>
                Your use of this app is also governed by our{" "}
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Disclaimer
              </h2>
              <p className="leading-relaxed">
                THE APP IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
                PARTICULAR PURPOSE, AND NONINFRINGEMENT.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Contact Information
              </h2>
              <p className="mb-2">For copyright inquiries or permissions:</p>
              <ul className="space-y-1 ml-4">
                <li><strong>Website:</strong> https://lovebond.vercel.app</li>
                <li><strong>GitHub:</strong> https://github.com/aakash2518/lovebond</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Governing Law
              </h2>
              <p>
                This copyright notice and your use of the app are governed by the laws of India.
              </p>
            </section>

            <section className="border-t pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Last Updated:</strong> February 6, 2026
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Acknowledgments
              </h2>
              <p>
                Special thanks to the open-source community for the libraries and tools that made this app possible.
              </p>
            </section>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg text-center mt-8">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                © 2026 LoveBond. All Rights Reserved.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Made with ❤️ for couples around the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
