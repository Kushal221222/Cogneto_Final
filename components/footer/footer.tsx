import { Brain } from "lucide-react"
import FooterLinks from "./footer-links"
import SocialIcons from "./social-icons"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Cogneto
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The intelligent note-taking app that thinks with you.
            </p>
            <SocialIcons />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <FooterLinks
              title="Product"
              links={[
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Roadmap", href: "/roadmap" },
                { label: "FAQ", href: "/faq" },
              ]}
            />

            <FooterLinks
              title="Company"
              links={[
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
              ]}
            />

            <FooterLinks
              title="Resources"
              links={[
                { label: "Documentation", href: "/docs" },
                { label: "Tutorials", href: "/tutorials" },
                { label: "Support", href: "/support" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cogneto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
