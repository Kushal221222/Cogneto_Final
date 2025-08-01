import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NetworkIcon as Connection, Lightbulb, Sparkles } from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-18">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Where{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Ideas Connect.
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                Cogneto is the intelligent note-taking app that thinks with you — organizing, suggesting, and evolving
                your thoughts into a connected system of ideas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur-xl opacity-75 animate-pulse"></div>
              <img
                src="https://i.ibb.co/Xr6X35LR/Synapso-Futuristic-Creative-Workspace.png"
                alt="Cogneto interface"
                className="relative rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        <section id="features" className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powered by smart algorithms and a beautiful, minimalist design, Cogneto helps you build a brain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-purple-600" />}
              title="Smart Suggestions"
              description="Our algorithms suggest related notes and uncover hidden connections between your ideas."
            />
            <FeatureCard
              icon={<Connection className="h-6 w-6 text-purple-600" />}
              title="Connected Thinking"
              description="Build a network of ideas that grows and evolves with your thought process."
            />
            <FeatureCard
              icon={<Lightbulb className="h-6 w-6 text-purple-600" />}
              title="Idea Evolution"
              description="Watch your notes transform from simple thoughts into a comprehensive knowledge system."
            />
          </div>
        </section>

        <section id="about" className="py-24 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://i.ibb.co/fVYSBzvn/Neural-Connections.png"
                alt="Cogneto interface visualization"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">The Future of Thought Organization</h2>
              <p className="text-gray-600 dark:text-gray-300">
                In a world overflowing with information, clarity is power. Cogneto is a next-generation note-taking
                platform designed to help thinkers, creators, and lifelong learners capture their ideas effortlessly —
                and uncover the hidden connections between them.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Inspired by the way synapses in the brain form links between thoughts, Cogneto goes beyond static notes.
                It learns with you, suggests relevant ideas, and helps you build a second brain — dynamically,
                intelligently, and beautifully.
              </p>
              <Button asChild>
                <Link href="/signup">Start Building Your Brain</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
