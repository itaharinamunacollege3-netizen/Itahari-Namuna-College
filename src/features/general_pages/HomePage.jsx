import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../../components/common/homeComponent/MetricCard";
import gsap from "gsap";
import { motion, AnimatePresence } from 'framer-motion';
import inc from "../../assets/home hero section/incCollege.jpg"
import pic1 from "../../assets/home hero section/bhm.png"
import pic2 from "../../assets/home hero section/graduation.jpg"
import pic3 from "../../assets/home hero section/group1.jpg"
import pic4 from "../../assets/home hero section/group2.jpg"
import pic5 from "../../assets/home hero section/hall4.jpg"
import pic6 from "../../assets/home hero section/hall5.jpg"
import pic7 from "../../assets/home hero section/hallgroup.png"
import {
  Calendar,
  Award,
  GraduationCap,
  ClipboardList,
  Bell,
} from "lucide-react";
import HomeProgramInfo from "../../components/common/homeComponent/HomeProgramInfo";
import HomeWhyChooseUs from "../../components/common/homeComponent/HomeWhyChooseUs";
import NoticePopup from "../notices/components/NoticePopup";
import { getNotices } from "../notices/services/noticesService";
import heroCampus from "../../assets/others/hero-campus.webp";
import AnimatedSection from "../../components/animations/AnimatedSection";

const TAG_ICONS = {
  IMPORTANT: Award,
  "TU Exams": ClipboardList,
  Admissions: GraduationCap,
  Holidays: Calendar,
};

export default function HomePage() {
  const marqueeRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [notices, setNotices] = useState([]);
  const carouselImages = [
    inc,
    pic1,
    pic2,
    pic3,
    pic4,
    pic5,
    pic6,
    pic7
  ];
  const carouselContent = [
    {
      title: "Itahari Namuna College",
      subtitle: "Excellence in undergraduate education through analytical thinking, professional competency, and ethical leadership.",
      cta: "Explore Academics",
      link: "/academic"
    },
    {
      title: "Your Future, Our Priority",
      subtitle: "Join a vibrant community of innovators. Build your career with our industry-aligned programs and expert guidance.",
      cta: "Apply Now",
      link: "/admissions"
    },
    {
      title: "Innovation Meets Tradition",
      subtitle: "Experience a campus built for growth, featuring modern infrastructure, dedicated faculty, and global learning opportunities.",
      cta: null, // No CTA for the third slide
      link: null
    }
  ];

  useEffect(() => {
    let active = true;
    getNotices().then((data) => {
      if (active) setNotices(data);
    });
    return () => {
      active = false;
    };
  }, []);


  // 1. Separate the Marquee logic into its own useEffect
  // Change your marquee useEffect dependency array
  // changed the marquee useEffect to check if the notices are loaded in the DOM then only run the animation. 
  // so added a delay 
  useEffect(() => {
    // Only run if there are notices
    if (notices.length === 0) return;

    const marqueeTrack = marqueeRef.current;
    if (!marqueeTrack) return;

    // Small delay to ensure the DOM has rendered the new content
    const timeout = setTimeout(() => {
      const trackWidth = marqueeTrack.scrollWidth / 2;

      const tickerAnimation = gsap.to(marqueeTrack, {
        x: -trackWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
      });

      const handleMouseEnter = () => tickerAnimation.pause();
      const handleMouseLeave = () => tickerAnimation.play();

      marqueeTrack.addEventListener("mouseenter", handleMouseEnter);
      marqueeTrack.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        tickerAnimation.kill();
        marqueeTrack.removeEventListener("mouseenter", handleMouseEnter);
        marqueeTrack.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, 100); // 100ms delay to allow DOM paint

    return () => clearTimeout(timeout);
  }, [notices]); // <--- Added 'notices' here

  // 2. Keep the Carousel timer in a separate useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);
  return (
    <div className="w-full bg-brand-gray min-h-screen">
      <NoticePopup />
      {/* ========================================================================= */}
      {/* HERO SECTION: Centered Contents Over a Full-Bleed Background Image         */}
      {/* ========================================================================= */}
      <AnimatedSection>
        <section className="relative w-full h-[calc(100vh-64px-41.6px)] min-h-137.5 flex items-center justify-center bg-brand-dark/70 overflow-hidden">
          {/* 1. College Background Image Media Layer */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Custom "power" ease
              className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-6"
            >
              {/* Heading: Slides up slightly with a fade */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} // Custom "power" ease
                className="font-serif font-black text-5xl sm:text-7xl tracking-tighter uppercase leading-none"
              >
                <span className="block text-brand-white">{carouselContent[index % carouselContent.length].title.split(' ')[0]}</span>
                <span className="block text-brand-white">
                  {carouselContent[index % carouselContent.length].title.split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>

              {/* Paragraph: Slides in from the left */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }} // Custom "power" ease
                className="font-heading text-sm sm:text-base md:text-lg text-brand-gray/90 max-w-2xl leading-relaxed font-normal mt-6 border-l-2 border-brand-blue pl-4"
              >
                {carouselContent[index % carouselContent.length].subtitle}
              </motion.p>

              {/* CTA: Fades in last */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Custom "power" ease
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto"
              >
                {carouselContent[index % carouselContent.length].cta && (
                  <Link
                    to={carouselContent[index % carouselContent.length].link}
                    className="w-full sm:w-auto bg-brand-primary text-brand-white font-heading font-bold text-sm tracking-wide px-8 py-3.5 rounded-xl hover:bg-brand-primary/90 hover:scale-103 active:scale-97 shadow-md transition-all duration-300 text-center"
                  >
                    {carouselContent[index % carouselContent.length].cta}
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </section>
      </AnimatedSection>
      {/* marquee */}
      <div className="w-full bg-brand-primary overflow-hidden py-3 flex items-center select-none cursor-pointer shadow-xs">
        {/* The Track element contains two sets of the data to stitch the loop perfectly */}
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap space-x-12 pl-12 will-change-transform"
        >
          {/* Primary Set Loop (doubled to stitch the infinite scroll) */}
          {[...notices, ...notices].map((notice, idx) => {
            const Icon = TAG_ICONS[notice.tags?.[0]] ?? Bell;
            return (
              <Link
                to={`/notices/${notice.id}`}
                key={idx}
                className="flex items-center space-x-3 text-brand-white font-heading font-bold text-xs sm:text-sm tracking-wide hover:text-brand-white/60 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{notice.title}</span>
                <span className="text-brand-white/40 font-normal px-2">•</span>
              </Link>
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
