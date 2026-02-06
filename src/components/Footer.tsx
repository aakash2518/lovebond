import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} LoveBond. All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/privacy-policy"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/copyright"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Copyright Notice
            </Link>
          </div>

          {/* Made with Love */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for couples</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            LoveBond is a relationship app designed to strengthen bonds between couples.
          </p>
          <p className="mt-1">
            All trademarks and copyrights belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
