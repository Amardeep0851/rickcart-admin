import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html, Stars } from "@react-three/drei";
import { motion } from "framer-motion";

// This file is a single-file Next.js page component you can drop into a
// pages/ (Next 12/13 pages router) or app/ (wrap as a React component in app/page.tsx) folder.
// Features:
// - Fullscreen hero with an interactive three.js scene (react-three-fiber + drei)
// - Responsive layout using Tailwind CSS classes
// - Small project grid and contact CTA
// - Accessible, lightweight scene with OrbitControls and subtle animation

// ---- Floating 3D Logo / Shape ----
function RotatingTorus() {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.y += delta * 0.15;
  });
  return (
    <Float floatIntensity={1} rotationIntensity={1} floatRange={[0.1, 0.45]}>
      <mesh ref={ref} castShadow>
        <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
        <meshStandardMaterial metalness={0.8} roughness={0.1} envMapIntensity={1} />
      </mesh>
    </Float>
  );
}

// ---- Subtle background elements and lights ----
function SceneDecor() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={80} depth={20} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

// ---- The Next.js Page Component ----
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800 text-white antialiased">
      {/* NAV */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight">Jōdōmo.dev</div>
        <div className="space-x-4 hidden md:flex">
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="bg-white/8 px-3 py-1 rounded backdrop-blur hover:bg-white/12">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Beautiful web experiences
            <br />
            powered by <span className="text-indigo-400">Three.js</span> & React
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-gray-300 max-w-xl"
          >
            I design and build fast, animated, and delightful websites using modern tools —
            WebGL for immersive visuals and Next.js for rock-solid performance.
          </motion.p>

          <div className="mt-8 flex gap-4">
            <a href="#projects" className="px-5 py-2 bg-indigo-500 rounded-md font-medium shadow hover:brightness-105">See projects</a>
            <a href="#contact" className="px-5 py-2 border border-white/10 rounded-md">Get in touch</a>
          </div>

          <div className="mt-8 text-sm text-gray-400">Tech: Next.js • React • Three.js • react-three-fiber • Tailwind</div>
        </div>

        {/* 3D CANVAS */}
        <div className="h-80 md:h-96 w-full bg-transparent rounded-2xl overflow-hidden shadow-2xl">
          <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
            <Suspense fallback={null}>
              <SceneDecor />
              <RotatingTorus />
              <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2} />
            </Suspense>
          </Canvas>
        </div>
      </header>

      {/* PROJECTS */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section id="projects">
          <h2 className="text-2xl font-semibold">Selected projects</h2>
          <p className="text-gray-400 mt-2">Small showcase of interactive experiments and client work.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <article className="bg-white/3 p-6 rounded-2xl backdrop-blur shadow">
              <h3 className="font-bold">Interactive Landing</h3>
              <p className="text-gray-300 mt-2 text-sm">A marketing website with animated hero and subtle 3D decorations.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">Next.js • Three.js</span>
                <a className="text-indigo-300 text-sm">View →</a>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-white/3 p-6 rounded-2xl backdrop-blur shadow">
              <h3 className="font-bold">Data Viz Tool</h3>
              <p className="text-gray-300 mt-2 text-sm">3D data visualization with WebGL acceleration.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">React • d3 • Three</span>
                <a className="text-indigo-300 text-sm">View →</a>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-white/3 p-6 rounded-2xl backdrop-blur shadow">
              <h3 className="font-bold">Portfolio CMS</h3>
              <p className="text-gray-300 mt-2 text-sm">Headless CMS + static generation for performance and SEO.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">Next.js • Sanity</span>
                <a className="text-indigo-300 text-sm">View →</a>
              </div>
            </article>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mt-12">
          <h2 className="text-2xl font-semibold">About me</h2>
          <p className="text-gray-300 mt-3 max-w-2xl">I craft responsive websites with thoughtful animations and strong accessibility. I focus on performance and progressive enhancement so sites are fast for everyone.</p>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-12 bg-white/4 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold">Let’s build something</h2>
          <p className="text-gray-300 mt-2">Tell me about your project and I’ll send a quick plan and estimate.</p>
          <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-3 bg-white/6 rounded" placeholder="Your name" />
            <input className="p-3 bg-white/6 rounded" placeholder="Email" />
            <textarea className="p-3 bg-white/6 rounded md:col-span-2" placeholder="Project summary" rows={4} />
            <button className="md:col-span-2 bg-indigo-500 px-4 py-2 rounded">Send message</button>
          </form>
        </section>

        <footer className="mt-12 text-sm text-gray-500">Made with ❤️ — contact@jodomodev.example</footer>
      </main>
    </div>
  );
}
