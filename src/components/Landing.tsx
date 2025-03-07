import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, CheckSquare, BarChart3, Calendar, ArrowRight, Sun, Moon, BookOpen, Target, Sparkles, Lightbulb } from 'lucide-react';

interface LandingProps {
  darkMode: boolean;
}

const Landing: React.FC<LandingProps> = ({ darkMode }) => {
  const features = [
    {
      icon: Brain,
      name: 'Thought Logger',
      description: 'Track and reframe negative thoughts, fears, and regrets with our cognitive behavioral therapy-inspired logger.'
    },
    {
      icon: CheckSquare,
      name: 'Smart Todo List',
      description: 'Prioritize tasks effectively with our intelligent todo system that adapts to your work patterns.'
    },
    {
      icon: Calendar,
      name: 'Weekly Planning',
      description: 'Set and track weekly goals with our structured planning system that keeps you accountable.'
    },
    {
      icon: BarChart3,
      name: 'Performance Analytics',
      description: 'Gain insights into your productivity and personal growth with comprehensive performance tracking.'
    }
  ];

  const insights = [
    {
      book: "Atomic Habits by James Clear",
      icon: Target,
      title: "Build Better Habits",
      quote: "Small changes, remarkable results",
      description: "Our Weekly Planning feature helps you implement the habit stacking technique, allowing you to build new habits by attaching them to existing ones.",
      feature: "Weekly Planner"
    },
    {
      book: "The Power of Now by Eckhart Tolle",
      icon: Sparkles,
      title: "Present Moment Awareness",
      quote: "Transform negative thinking patterns",
      description: "Use our Thought Logger to practice mindfulness and catch negative thought patterns before they spiral, staying grounded in the present moment.",
      feature: "Thought Logger"
    },
    {
      book: "Deep Work by Cal Newport",
      icon: Lightbulb,
      title: "Focus & Productivity",
      quote: "Track your deep work sessions",
      description: "Our Performance Analytics help you monitor your productivity patterns and optimize your focus periods for maximum impact.",
      feature: "Performance Tracker"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transform Your Life with
              <span className="text-primary-600 dark:text-primary-400 block sm:inline"> GrowthTrack</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-300">
              Your all-in-one personal development companion. Track your progress, manage your thoughts,
              and achieve your goals with our comprehensive suite of tools.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link
                to="/signup"
                className="w-full sm:w-auto rounded-md bg-primary-600 px-4 sm:px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto text-center text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
            Everything you need
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Features that empower your growth
          </p>
        </div>

        <div className="mx-auto mt-12 sm:mt-16 lg:mt-20">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-3 text-base font-semibold text-gray-900 dark:text-white mb-3">
                  <feature.icon
                    className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Self-help insights section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
              Backed by Research
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Transform Your Life with Proven Methods
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our features are inspired by insights from leading self-help authors and backed by proven psychological principles.
            </p>
          </div>

          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <div 
                key={insight.book} 
                className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-102 hover:shadow-xl"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-x-2 text-xs sm:text-sm mb-4">
                    <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {insight.book}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
                        <insight.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                      {insight.title}
                    </h3>
                  </div>
                  <blockquote className="italic text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                    "{insight.quote}"
                  </blockquote>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                    {insight.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      to="/signup"
                      className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
                    >
                      Try {insight.feature}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl">
          <div
            className="ml-[max(50%-11rem,3.5rem)] aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-primary-200 to-primary-600"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Start your growth journey today
          </h2>
          <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-300">
            Join thousands of others who are using GrowthTrack to transform their lives and achieve their goals.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link
              to="/signup"
              className="w-full sm:w-auto rounded-md bg-primary-600 px-4 sm:px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Get started for free
            </Link>
            <a href="#features" className="w-full sm:w-auto text-center text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;