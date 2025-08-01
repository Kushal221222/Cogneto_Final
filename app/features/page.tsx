import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, CheckCircle2, Sparkles, NetworkIcon, Calendar, Tag, Star, Grid3X3, FileText } from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="pt-24">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Productive Thinking
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover all the tools Synapso offers to help you capture, organize, and connect your ideas.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-purple-600" />}
                title="Smart Note-Taking"
                description="Create rich notes with formatting, tags, and attachments. Our intelligent system suggests tags and connections as you write."
              />
              <FeatureCard
                icon={<Grid3X3 className="h-10 w-10 text-purple-600" />}
                title="Priority Matrix"
                description="Organize tasks using the Eisenhower Matrix to focus on what's truly important. Drag and drop notes between quadrants."
              />
              <FeatureCard
                icon={<NetworkIcon className="h-10 w-10 text-purple-600" />}
                title="Knowledge Graph"
                description="Visualize connections between your notes and ideas. Discover relationships you might have missed."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-purple-600" />}
                title="Timeline View"
                description="See your notes organized chronologically. Perfect for tracking progress and reviewing past ideas."
              />
              <FeatureCard
                icon={<Tag className="h-10 w-10 text-purple-600" />}
                title="Smart Tagging"
                description="Automatically suggested tags based on content. Organize and filter notes by custom tags."
              />
              <FeatureCard
                icon={<Star className="h-10 w-10 text-purple-600" />}
                title="Favorites & Collections"
                description="Save important notes as favorites and organize them into collections for easy access."
              />
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-purple-600" />}
                title="AI Suggestions"
                description="Get intelligent suggestions for note organization, priorities, and connections based on your content."
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-purple-600" />}
                title="Second Brain Building"
                description="Create a comprehensive knowledge system that grows and evolves with your thinking."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-10 w-10 text-purple-600" />}
                title="Task Management"
                description="Turn notes into actionable tasks with due dates, reminders, and priority levels."
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Compare Plans</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Free</h3>
                    <p className="text-3xl font-bold">
                      $0<span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Perfect for getting started</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <PlanFeature included>Up to 100 notes</PlanFeature>
                    <PlanFeature included>Basic tagging</PlanFeature>
                    <PlanFeature included>Priority matrix</PlanFeature>
                    <PlanFeature included>Timeline view</PlanFeature>
                    <PlanFeature>Advanced AI suggestions</PlanFeature>
                    <PlanFeature>Unlimited file attachments</PlanFeature>
                    <PlanFeature>Knowledge graph</PlanFeature>
                  </ul>

                  <Button asChild className="w-full">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-purple-200 dark:border-purple-800 p-6 shadow-sm relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Pro</h3>
                    <p className="text-3xl font-bold">
                      $9.99<span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">For power users</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <PlanFeature included>Unlimited notes</PlanFeature>
                    <PlanFeature included>Advanced tagging</PlanFeature>
                    <PlanFeature included>Priority matrix</PlanFeature>
                    <PlanFeature included>Timeline view</PlanFeature>
                    <PlanFeature included>Advanced AI suggestions</PlanFeature>
                    <PlanFeature included>Unlimited file attachments</PlanFeature>
                    <PlanFeature included>Knowledge graph</PlanFeature>
                  </ul>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Note-Taking?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are building their second brain with Synapso.
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
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function PlanFeature({ included = false, children }) {
  return (
    <li className="flex items-center">
      {included ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <div className="h-5 w-5 border border-gray-300 dark:border-gray-600 rounded-full mr-2 flex-shrink-0" />
      )}
      <span className={included ? "" : "text-gray-500 dark:text-gray-400"}>{children}</span>
    </li>
  )
}
