import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { MapPin, Instagram, Mail, ArrowRight, Coffee, Croissant, Utensils, Star, Clock } from 'lucide-react';

// --- CUSTOM CURSOR ---
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-400/50 pointer-events-none z-[100] mix-blend-screen flex items-center justify-center backdrop-blur-sm"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full shadow-[0_0_15px_#d946ef]" />
    </motion.div>
  );
}

// --- MAGNETIC BUTTON ---
function MagneticButton({ children, className = '', onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full group ${className}`}
    >
      {/* Glow effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-600/50 to-emerald-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

// --- 3D TILT CARD ---
function TiltCard({ title, desc, icon: Icon, delay = 0 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="relative [perspective:1000px] w-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-[400px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-end relative overflow-hidden group cursor-crosshair shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Floating Icon */}
        <motion.div 
          style={{ translateZ: "50px" }}
          className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-auto shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-shadow duration-500 text-emerald-400"
        >
          <Icon size={32} strokeWidth={1.5} />
        </motion.div>

        <motion.div style={{ translateZ: "30px" }}>
          <h3 className="text-3xl font-light tracking-tight text-white mb-3">{title}</h3>
          <p className="text-zinc-400 font-light leading-relaxed">{desc}</p>
        </motion.div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 rounded-tl-3xl m-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-3xl m-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
}

// --- AMBIENT BACKGROUND ---
function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-zinc-950">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/30 blur-[150px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -100, 0],
          y: [0, 100, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-600/20 blur-[150px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-amber-500/20 blur-[100px]"
      />
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const { scrollYProgress } = useScroll();
  
  // Parallax mappings
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Mouse Parallax for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleGlobalMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    mouseX.set(x);
    mouseY.set(y);
  };

  // 3D Object Transforms
  const objectRotateX = useTransform(smoothMouseY, [-1, 1], [30, -30]);
  const objectRotateY = useTransform(smoothMouseX, [-1, 1], [-30, 30]);

  return (
    <div 
      className="min-h-screen text-zinc-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden"
      onMouseMove={handleGlobalMouseMove}
    >
      <CustomCursor />
      <AmbientBackground />

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full p-8 z-50 mix-blend-difference flex justify-between items-center">
        <div className="text-xl font-bold tracking-widest">CB.</div>
        <nav className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-white/70">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#menu" className="hover:text-white transition-colors">Menu</a>
          <a href="#gallery" className="hover:text-white transition-colors">Experience</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>
        <button className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5">
          <div className="w-full h-[2px] bg-white rounded-full"></div>
          <div className="w-2/3 h-[2px] bg-white rounded-full ml-auto"></div>
        </button>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden [perspective:1000px]">
        {/* Abstract 3D Central Element */}
        <motion.div 
          style={{ rotateX: objectRotateX, rotateY: objectRotateY, y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="relative w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] [transform-style:preserve-3d]">
            <motion.div 
              animate={{ rotateZ: 360, rotateX: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.05)] [transform-style:preserve-3d]"
            >
               <div className="absolute inset-[-10%] rounded-full border-[0.5px] border-emerald-500/20 [transform:rotateX(75deg)]" />
               <div className="absolute inset-[-10%] rounded-full border-[0.5px] border-fuchsia-500/20 [transform:rotateY(75deg)]" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full backdrop-blur-[2px] mix-blend-overlay shadow-[0_0_80px_rgba(16,185,129,0.1)]"></div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center pointer-events-none mix-blend-screen"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase text-zinc-400">
              A Premium Culinary Experience
            </span>
            <Star className="w-4 h-4 text-amber-400" />
          </motion.div>

          <h1 className="text-6xl md:text-[9vw] font-black tracking-tighter leading-none flex overflow-hidden py-2">
            {"CAFE BELFIELD".split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.2, 0.8, 0.2, 1],
                  delay: i * 0.05
                }}
                className={char === " " ? "w-[2vw]" : "inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl"}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 pointer-events-auto"
          >
            <MagneticButton className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-sm font-medium tracking-widest uppercase transition-all duration-300">
              Explore Menu <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[10px] tracking-widest uppercase text-white/40">Scroll</span>
          <div className="w-[1px] h-12 bg-white/10 overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent" 
            />
          </div>
        </motion.div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 px-6 md:px-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10" />
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop" 
                alt="Cafe Interior" 
                className="w-full h-full object-cover filter contrast-125 brightness-75 scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            {/* Floating Glass Box */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute -bottom-10 -right-10 md:-right-20 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-[300px]"
            >
              <Clock className="w-8 h-8 text-fuchsia-400 mb-4" />
              <h4 className="text-xl font-light mb-2">Redefining Belfield</h4>
              <p className="text-sm text-zinc-400 font-light">Where artisanal craft meets architectural design.</p>
            </motion.div>
          </motion.div>

          <div className="w-full lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-light tracking-tight mb-8"
            >
              Beyond the <span className="italic text-emerald-400">ordinary</span> brew.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-10"
            >
              Cafe Belfield is a sensory immersion. We meticulously source our beans, curate our ingredients, and sculpt our space to provide an unparalleled brunch experience in the heart of NSW.
            </motion.p>
            
            <div className="flex gap-4">
              <MagneticButton className="px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full font-medium text-sm tracking-widest uppercase transition-colors">
                Our Story
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES / MENU TILT CARDS --- */}
      <section id="menu" className="py-32 px-6 md:px-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">The Menu</h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mt-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltCard 
              delay={0}
              icon={Coffee}
              title="Artisan Coffee"
              desc="Single-origin beans roasted to perfection, offering notes of dark cocoa and wild berries. Extracted with precision."
            />
            <TiltCard 
              delay={0.2}
              icon={Utensils}
              title="Premium Brunch"
              desc="A modern take on classics. Truffle-infused mushrooms on organic sourdough and responsibly sourced ingredients."
            />
            <TiltCard 
              delay={0.4}
              icon={Croissant}
              title="Signature Pastries"
              desc="Laminated doughs baked daily. Experience our twice-baked almond croissants and seasonal fruit danishes."
            />
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE GALLERY (BENTO BOX) --- */}
      <section id="gallery" className="py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
            {/* Box 1 - Large Left */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop" alt="Pour over coffee" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
              <div className="absolute bottom-8 left-8 z-20">
                <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">The Craft</p>
                <h3 className="text-3xl font-light text-white">Precision Pour Over</h3>
              </div>
            </motion.div>

            {/* Box 2 - Top Right Small */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 md:row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer"
            >
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
               <img src="https://images.unsplash.com/photo-1484723091791-c0e7e147bc6a?q=80&w=1500&auto=format&fit=crop" alt="Gourmet Brunch" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
               <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-light text-white">Culinary Art</h3>
              </div>
            </motion.div>

            {/* Box 3 - Bottom Right Small */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer bg-zinc-900 flex items-center justify-center border border-white/10"
            >
               <div className="text-center p-6">
                 <Instagram className="w-10 h-10 mx-auto mb-4 text-zinc-500 group-hover:text-fuchsia-400 transition-colors duration-500" />
                 <p className="text-sm tracking-widest uppercase font-bold text-white/50 group-hover:text-white transition-colors duration-500">@cafebelfield</p>
               </div>
            </motion.div>

            {/* Box 4 - Bottom Right Small 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer"
            >
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
               <img src="https://images.unsplash.com/photo-1550461716-ba31289fc325?q=80&w=1000&auto=format&fit=crop" alt="Interior Details" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CONTACT / LOCATION SECTION --- */}
      <section id="contact" className="py-32 px-6 md:px-20 relative">
        <div className="max-w-5xl mx-auto rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="p-12 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-8">Visit the <span className="font-bold">Sanctuary.</span></h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <MapPin className="w-5 h-5 text-zinc-300 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-widest uppercase mb-2 text-white/50">Location</h4>
                    <p className="text-lg font-light text-zinc-200">Unit 2/24 Burwood Rd,<br/>Belfield NSW 2191</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <Mail className="w-5 h-5 text-zinc-300 group-hover:text-fuchsia-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-widest uppercase mb-2 text-white/50">Inquiries</h4>
                    <p className="text-lg font-light text-zinc-200">hello@cafebelfield.com.au</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glass Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all font-light placeholder:text-white/30"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all font-light placeholder:text-white/30"
                />
              </div>
              <div>
                <textarea 
                  rows="4"
                  placeholder="Message" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all font-light placeholder:text-white/30 resize-none"
                ></textarea>
              </div>
              <MagneticButton className="w-full py-5 bg-white text-black rounded-2xl font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors">
                Send Message
              </MagneticButton>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-20 text-center md:text-left relative z-10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-black tracking-widest">CAFE BELFIELD</div>
          <p className="text-sm text-zinc-500 font-light">&copy; {new Date().getFullYear()} Cafe Belfield. A Premium Experience.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/cafebelfield/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}