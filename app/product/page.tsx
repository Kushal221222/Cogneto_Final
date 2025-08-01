import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="pt-24">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Organize Your Thoughts with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Synapso
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              The intelligent note-taking app that helps you connect ideas, prioritize tasks, and build your second
              brain.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">How Synapso Works</h2>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl">
                      <img
                        src="/placeholder.svg?height=300&width=400"
                        alt="Capture ideas"
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-semibold mb-4">Capture Ideas Effortlessly</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Quickly jot down thoughts, ideas, and tasks with our intuitive interface. Add tags, set
                      priorities, and organize your notes with ease.
                    </p>
                    <ul className="space-y-2">
                      {["Fast note creation", "Smart tagging system", "Priority matrix organization"].map((item) => (
                        <li key={item} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                  <div className="md:w-1/2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-xl">
                      <img
                        src="/placeholder.svg?height=300&width=400"
                        alt="Connect ideas"
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-semibold mb-4">Connect Related Ideas</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Synapso helps you discover connections between your notes, creating a network of knowledge that
                      evolves with your thinking.
                    </p>
                    <ul className="space-y-2">
                      {["Automatic suggestion of related notes", "Visual knowledge graph", "Tag-based connections"].map(
                        (item) => (
                          <li key={item} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl">
                      <img
                        src="/placeholder.svg?height=300&width=400"
                        alt="Prioritize tasks"
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-semibold mb-4">Prioritize Tasks Effectively</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Use our Eisenhower Matrix to categorize tasks based on urgency and importance. Focus on what
                      matters most and achieve your goals.
                    </p>
                    <ul className="space-y-2">
                      {["4-quadrant priority matrix", "Drag-and-drop organization", "Smart priority suggestions"].map(
                        (item) => (
                          <li key={item} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Note-Taking?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are building their second brain with Synapso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/features">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
