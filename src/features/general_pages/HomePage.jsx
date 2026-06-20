import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../../components/common/homeComponent/MetricCard";
import gsap from "gsap";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Award,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import HomeProgramInfo from "../../components/common/homeComponent/HomeProgramInfo";
import HomeWhyChooseUs from "../../components/common/homeComponent/HomeWhyChooseUs";
import introVideo from '../../assets/video/inc intro.mp4'
import heroCampus from "../../assets/others/hero-campus.webp";
import AnimatedSection from "../../components/animations/AnimatedSection";

export default function HomePage() {
  const marqueeRef = useRef(null);
  const [index, setIndex] = useState(0);
  const carouselImages = [
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0013.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/05/431483808_795662615915204_394360178496327343_n.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0001.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDATC5mhy8ITyuVqM_tGYJlQSkZTug5mmpOu3xHpXDse8LTOWagfNgB9z8&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR3WMqM_LwyPxCbZQFIAr8KFnJhVDKqax0ErLRsuuDZydnNgvHMRFnFQk&s=10",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0001.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0046.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0035.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0008.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0023.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0032.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Al9YKLxUiu56-gggo1i7bF0LXktwA0KIiaRvWJ6ycerUoTxGn3q47t8&s=10",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0032.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR3WMqM_LwyPxCbZQFIAr8KFnJhVDKqax0ErLRsuuDZydnNgvHMRFnFQk&s=10",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0036.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq2MjMjPa-QAKZstcozBLbq8rrVbMsKZcIkP7-mod2OQ&s",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0042.jpg",
    "https://namunacollege.edu.np/wp-content/uploads/2024/06/IMG-20240503-WA0059.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR3WMqM_LwyPxCbZQFIAr8KFnJhVDKqax0ErLRsuuDZydnNgvHMRFnFQk&s=10",
  ];

  // Dynamic Notice Board content array matching
  const urgentNotices = [
    {
      text: "Admission Open for BCA, BHM, BBM & BSW — Session 2083/84",
      icon: GraduationCap,
    },
    {
      text: "TU Examination Routine Released — 4th Semester 2082",
      icon: ClipboardList,
    },
    { text: "Annual Sports Week: June 22–28, 2026", icon: Award },
    {
      text: "Scholarship Applications Open — Merit & Need-Based 2083",
      icon: Calendar,
    },
  ];

  // 1. Separate the Marquee logic into its own useEffect
  useEffect(() => {
    const marqueeTrack = marqueeRef.current;
    if (!marqueeTrack) return;

    const trackWidth = marqueeTrack.scrollWidth / 2;

    const tickerAnimation = gsap.to(marqueeTrack, {
      x: -trackWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    // Define handlers as variables so they can be removed properly
    const handleMouseEnter = () => tickerAnimation.pause();
    const handleMouseLeave = () => tickerAnimation.play();

    marqueeTrack.addEventListener("mouseenter", handleMouseEnter);
    marqueeTrack.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tickerAnimation.kill();
      marqueeTrack.removeEventListener("mouseenter", handleMouseEnter);
      marqueeTrack.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); // Empty dependency array ensures this runs once

  // 2. Keep the Carousel timer in a separate useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);
  return (
    <div className="w-full bg-brand-gray min-h-screen">
      {/* ========================================================================= */}
      {/* HERO SECTION: Centered Contents Over a Full-Bleed Background Image         */}
      {/* ========================================================================= */}
      <AnimatedSection>
        <section className="relative w-full h-[82vh] min-h-137.5 flex items-center justify-center bg-brand-dark overflow-hidden">
          {/* 1. College Background Image Media Layer */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence> {/* Removed mode='wait' */}
              <motion.img
                key={index}
                src={carouselImages[index]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                // Use absolute so the new image sits ON TOP of the fading image
                className="absolute w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Keep your dark mask overlay here */}
            <div className="absolute inset-0 z-10 bg-linear-to-b from-brand-dark/70 via-brand-dark/60 to-brand-dark/75 mix-blend-multiply" />
          </div>

          {/* 2. Content Canvas: Deeply Centered Layout Shell */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-6">
            {/* Top Pill Status Badge (Inspired by image_3a8ca1.png) */}
            <div className="inline-flex items-center space-x-2 bg-brand-blue/15 backdrop-blur-md border border-brand-blue/30 px-4 py-1.5 rounded-full shadow-xs animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-brand-blue font-body font-semibold text-xs tracking-wide">
                Admissions Open 2083/84
              </span>
            </div>

            {/* Core Master Punchlines (Inspired by typography hierarchy in image_3a8ca1.png) */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-white tracking-tight leading-[1.1] max-w-3xl">
              Shaping <span className="text-brand-gold">Future Leaders</span>{" "}
              Through Excellence in Education
            </h1>

            {/* Subtext Paragraph Box with Constrained Paragraph Width */}
            <p className="font-body text-sm sm:text-base md:text-lg text-brand-gray/90 max-w-2xl leading-relaxed font-normal">
              Offering TU-affiliated undergraduate programs designed to develop
              analytical thinking, professional competency, and ethical leadership
              in every graduate.
            </p>

            {/* Dual Action CTA Buttons (Inspired by image_3a8ca1.png alignment design) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link
                to="/academic"
                className="w-full sm:w-auto bg-brand-primary text-brand-white font-heading font-bold text-sm tracking-wide px-8 py-3.5 rounded-xl hover:bg-brand-primary/90 hover:scale-103 active:scale-97 shadow-md shadow-brand-primary/20 transition-all duration-300 text-center"
              >
                Explore Academics
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-brand-white/10 backdrop-blur-xs text-brand-white border border-brand-white/30 font-heading font-bold text-sm tracking-wide px-8 py-3.5 rounded-xl hover:bg-brand-white/20 hover:scale-103 active:scale-97 transition-all duration-300 text-center"
              >
                Admissions
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
      {/* marquee */}
      <div className="w-full bg-[#f1b24a] border-y border-[#dca03b] overflow-hidden py-3 flex items-center select-none cursor-pointer shadow-xs">
        {/* The Track element contains two sets of the data to stitch the loop perfectly */}
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap space-x-12 pl-12 will-change-transform"
        >
          {/* Primary Set Loop */}
          {[...urgentNotices, ...urgentNotices].map((notice, idx) => {
            const Icon = notice.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-3 text-brand-dark font-heading font-bold text-xs sm:text-sm tracking-wide"
              >
                <Icon className="w-4 h-4 text-brand-dark shrink-0" />
                <span>{notice.text}</span>
                <span className="text-brand-dark/40 font-normal px-2">•</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* welcome section */}
      <AnimatedSection>
        <section className="w-full bg-brand-white py-20 lg:py-24 overflow-hidden relative">
          {/* Soft background glow to eliminate template flatness */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT CANVAS: Premium Typography & Structural High-Contrast Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-0.5 bg-brand-primary rounded-full block" />
                  <span className="text-xs font-bold text-brand-primary tracking-widest uppercase block">
                    A Decade of Excellence
                  </span>
                </div>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-dark tracking-tight leading-tight">
                  Welcome to <br className="hidden sm:inline" />
                  <span className="bg-linear-to-r from-brand-primary to-brand-blue bg-clip-text text-transparent">
                    Itahari Namuna College
                  </span>
                </h2>
              </div>

              <div className="font-body text-sm sm:text-base text-brand-dark/80 space-y-5 leading-relaxed font-normal max-w-3xl">
                <p className="first-letter:text-5xl first-letter:font-semibold first-letter:text-brand-primary first-letter:mr-2 first-letter:float-left first-letter:lh-1">
                  Itahari Namuna College, a leading institute of Itahari Sunsari,
                  established in 2070 BS, is heading towards a decade of operation
                  now. It has proven to be a reputed educational institution
                  through its numerous quality teaching learning activities.
                </p>
                <p>
                  The College lives true to its vision with a collective dream,
                  well-realized, a vision made by a group of committed
                  educationists from the eastern part of Nepal to provide an
                  excellent platform for quality higher education within the
                  province. As a result, the college remains a proud institution
                  with a unique distinction and a privilege to stand as a well
                  equipped college with modern facilities and infrastructure that
                  distinguishes it.
                </p>
              </div>

              {/* Border-Isolated Feature Blocks (No Interaction, Pure Visual Information Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-gray/60">
                <div className="space-y-1 p-1">
                  <h4 className="font-heading font-extrabold text-sm text-brand-dark uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <span>Academic Distinction</span>
                  </h4>
                  <p className="font-body text-xs text-brand-dark/60 leading-normal pl-3.5">
                    Providing excellent opportunities responsive to the exact
                    economic and modern needs of the local community.
                  </p>
                </div>
                <div className="space-y-1 p-1">
                  <h4 className="font-heading font-extrabold text-sm text-brand-dark uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    <span>Forward Vision</span>
                  </h4>
                  <p className="font-body text-xs text-brand-dark/60 leading-normal pl-3.5">
                    Driven by a dedicated board of veteran eastern educationists
                    committed to elite-tier global frameworks.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT CANVAS: 3D Editorial Framed Media & Floating Micro-Statement Layer */}
            <div className="lg:col-span-5 relative pt-6 lg:pt-0">
              {/* Decorative Geometric Dot Pattern & Frame Background Shadows */}
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-brand-gold/10 rounded-2xl blur-xl pointer-events-none" />
              <div className="absolute -top-10 -right-6 text-brand-gray/40 pointer-events-none hidden sm:block opacity-60">
                <svg
                  width="100"
                  height="100"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="6" cy="2" r="1.5" />
                  <circle cx="10" cy="2" r="1.5" />
                  <circle cx="14" cy="2" r="1.5" />
                  <circle cx="18" cy="2" r="1.5" />
                  <circle cx="2" cy="6" r="1.5" />
                  <circle cx="6" cy="6" r="1.5" />
                  <circle cx="10" cy="6" r="1.5" />
                  <circle cx="14" cy="6" r="1.5" />
                  <circle cx="18" cy="6" r="1.5" />
                  <circle cx="2" cy="10" r="1.5" />
                  <circle cx="6" cy="10" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="14" cy="10" r="1.5" />
                  <circle cx="18" cy="10" r="1.5" />
                  <circle cx="2" cy="14" r="1.5" />
                  <circle cx="6" cy="14" r="1.5" />
                  <circle cx="10" cy="14" r="1.5" />
                  <circle cx="14" cy="14" r="1.5" />
                  <circle cx="18" cy="14" r="1.5" />
                </svg>
              </div>

              <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                {/* Asymmetric Offset Color Accent Border Plate */}
                <div className="absolute -inset-3 rounded-2xl bg-linear-to-tr from-[#f1b24a] to-brand-primary opacity-15 transform translate-x-4 translate-y-4 pointer-events-none" />

                {/* Main Premium Card Image Box */}
                <div className="relative bg-brand-white p-3 rounded-3xl border border-brand-gray/80 shadow-xl overflow-hidden">
                  <img loading="lazy" decoding="async"
                    src={heroCampus}
                    alt="Itahari Namuna Campus Main Academic Wing"
                    className="w-full h-80 sm:h-100 object-cover rounded-2xl shadow-inner grayscale-15 hover:grayscale-0 transition-all duration-700"
                  />

                  {/* Subtle Custom Angular Framing Shape matching image_39149e.jpg signature line */}
                  <div className="absolute top-3 right-3 w-20 h-20 pointer-events-none overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-linear-to-bl from-[#f1b24a] via-transparent to-transparent opacity-90" />
                  </div>
                </div>

                {/* FLOATING CORNER STATEMENT BADGE: Intersects image layer for premium composition layout */}
                <div className="absolute -top-4 -left-4 bg-brand-dark text-brand-white p-4 rounded-2xl border border-brand-white/10 shadow-xl max-w-37.5 text-left backdrop-blur-md">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-[#f1b24a] block leading-none">
                    13+
                  </span>
                  <span className="font-body font-bold text-[10px] sm:text-xs text-brand-gray/80 tracking-wide uppercase block mt-1.5 leading-tight">
                    Years Academic Legacy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <MetricCard />
      </AnimatedSection>
      <AnimatedSection>
        <HomeProgramInfo />
      </AnimatedSection>
      <AnimatedSection>
        <HomeWhyChooseUs />
      </AnimatedSection>
    </div>
  );
}
