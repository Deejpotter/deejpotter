import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

export default function Home(): ReactElement {
  return (
    <>
      <Script id="schema-person" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://deejpotter.com/#person",
            "name": "Deej Potter",
            "jobTitle": "Web Developer",
            "url": "https://deejpotter.com",
            "sameAs": [
              "https://www.facebook.com/deej.potter.7/",
              "https://www.linkedin.com/in/daniel-potter-5224a4119"
            ]
          }
        `}
      </Script>

      <Script id="schema-portfolio" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": "https://deejpotter.com/#portfolio",
            "about": {
              "@id": "https://deejpotter.com/#person"
            },
            "mainEntity": {
              "@id": "https://deejpotter.com/#person"
            }
          }
        `}
      </Script>

      <section className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
          Welcome to My Portfolio
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          I&apos;m a web developer focused on creating high-quality,
          user-friendly websites and applications. With expertise in modern
          frameworks like React and Next.js, I build solutions that are both
          beautiful and functional.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">My Expertise</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Frontend Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating responsive, accessible user interfaces with React,
              TypeScript, and modern CSS.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Backend Integration</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Building APIs and server-side logic that powers web applications.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-2">
              Performance Optimization
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ensuring websites load quickly and function smoothly on all
              devices.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Work</h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Portfolio Projects</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Explore my various projects across web development, apps, games,
              and engineering.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects/websites"
                className="text-sm bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Websites
              </Link>
              <Link
                href="/projects/apps"
                className="text-sm bg-info hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Apps
              </Link>
              <Link
                href="/projects/games"
                className="text-sm bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Games
              </Link>
              <Link
                href="/projects/engineering"
                className="text-sm bg-warning hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Engineering
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Services</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Professional services for hobbyists and small businesses.
            </p>
            <Link
              href="/projects/services/3d-printing"
              className="inline-block bg-transparent hover:bg-primary text-primary dark:text-gray-100 font-semibold hover:text-white py-2 px-4 border border-primary hover:border-transparent rounded-full transition-all"
            >
              3D Printing Service
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/contact"
              className="inline-block bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
