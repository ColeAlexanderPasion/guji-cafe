import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  ArrowRight,
  Star, 
  Heart,
  Search,
  Calendar,
  Users,
  Clock,
  Coffee as CoffeeIcon,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Award,
  BookOpen,
  Compass,
  Smile,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import CinematicHeroBackground from './components/CinematicHeroBackground';

// Custom hand-selected premium coffee visual placeholders
const IMAGES = {
  signatureRoastBg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
  signatureCup: "https://images.unsplash.com/photo-151097252790b-af4f42dfb14a?q=80&w=600&auto=format&fit=crop",
  baristaStory: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
  beansStory: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop",
  interiorStory: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop",
  galleryPour: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop",
  galleryBeans: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
  galleryMachine: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
  galleryLatteArt: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop",
  galleryTable: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop",
  galleryPastries: "https://images.unsplash.com/photo-1600431521340-491dea880813?q=80&w=600&auto=format&fit=crop",
  reservationBg: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1200&auto=format&fit=crop"
};

// -------------------------------------------------------------
// INTERACTIVE HELPER 1: FadeIn scroll trigger wrapper
// -------------------------------------------------------------
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  id?: string;
  key?: React.Key;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = "",
  id
}: FadeInProps) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-20px", amount: 0.1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// -------------------------------------------------------------
// INTERACTIVE HELPER 1.5: SafeImage component with elegant fallbacks & load animations
// -------------------------------------------------------------
interface SafeImageProps {
  src?: string;
  fallbackSrc?: string;
  className?: string;
  alt?: string;
  loading?: "lazy" | "eager";
  [key: string]: any;
}

export function SafeImage({ src, fallbackSrc, className = "", alt = "", ...props }: SafeImageProps) {
  const [errorCount, setErrorCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultFallbacks = [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop", // Steam Coffee
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop", // Coffee Cup
    "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop", // Latte Art
    "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop"  // Pour-over
  ];

  const handleImgError = () => {
    if (errorCount < defaultFallbacks.length) {
      setErrorCount((prev) => prev + 1);
    }
  };

  const getSource = () => {
    if (!src || errorCount > 0) {
      if (fallbackSrc && errorCount === 0) {
        return fallbackSrc;
      }
      const idx = Math.min(Math.max(0, errorCount - 1), defaultFallbacks.length - 1);
      return defaultFallbacks[idx];
    }
    return src;
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1B120D]">
      {/* Skeleton / Ambient loading backdrop */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-espresso via-[#1d120c] to-espresso animate-pulse flex items-center justify-center z-10">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#E2B77C]/40">
            GUJI // Bloom
          </div>
        </div>
      )}
      <img
        src={getSource()}
        onError={handleImgError}
        onLoad={() => setIsLoaded(true)}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"} transition-all duration-700 ease-out`}
        {...props}
      />
    </div>
  );
}

// -------------------------------------------------------------
// INTERACTIVE HELPER 2: Magnet magnetic mouse pull wrapper
// -------------------------------------------------------------
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

export function Magnet({
  children,
  padding = 130,
  strength = 4,
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const insideArea =
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;

    if (!insideArea) {
      setActive(false);
      setTransform("translate3d(0px, 0px, 0px)");
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const moveX = (e.clientX - centerX) / strength;
    const moveY = (e.clientY - centerY) / strength;

    setActive(true);
    setTransform(`translate3d(${moveX}px, ${moveY}px, 0px)`);
  };

  const reset = () => {
    setActive(false);
    setTransform("translate3d(0px, 0px, 0px)");
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{
        transform,
        transition: active
          ? "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)"
          : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

// -------------------------------------------------------------
// INTERACTIVE HELPER 3: AnimatedText Character-by-character reveal
// -------------------------------------------------------------
interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });

  const chars = text.split("");

  return (
    <p ref={ref} className={className}>
      {chars.map((char, index) => {
        // Compute individual range offsets for standard staggering
        const start = index / chars.length;
        const end = Math.min(start + 0.12, 1);
        
        // Map individual character opacity
        const opacity = useTransform(scrollYProgress, [start, end], [0.18, 1]);

        return (
          <span key={index} className="relative inline">
            <span className="opacity-0">{char}</span>
            <motion.span
              style={{ opacity }}
              className={`absolute left-0 top-0 ${
                ["ritual", "intention", "pour", "patience", "craft"].some(term => 
                  text.substring(Math.max(0, index - 8), index + 8).toLowerCase().includes(term)
                ) ? "text-light-caramel font-semibold" : ""
              }`}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </p>
  );
}

// -------------------------------------------------------------
// INTERACTIVE HELPER 4: Horizontal Scroll Coffee Marquee Section
// -------------------------------------------------------------
const marqueeImagesRow1 = [
  "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop", // Pour-over
  "https://images.unsplash.com/photo-151097252790b-af4f42dfb14a?q=80&w=600&auto=format&fit=crop", // Espresso
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop", // Latte tulip
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop", // Selected beans
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop", // Barista pour
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop", // Cafe atmosphere
];

const marqueeImagesRow2 = [
  "https://images.unsplash.com/photo-1600431521340-491dea880813?q=80&w=600&auto=format&fit=crop", // Bakery croissant
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop", // Steam rising
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", // Beautiful coffee packaging
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop", // Cozy table layout
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=600&auto=format&fit=crop", // Cold brew slow drips
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop"  // Warm brick interiors
];

export function CoffeeMarquee() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  const row1Captions = ["Brew Time", "Warm Corners", "Daily Coffee", "Fresh Pour", "Gather Here", "Signature Moments"];
  const row2Captions = ["Daily Coffee", "Signature Moments", "Brew Time", "Warm Corners", "Fresh Pour", "Gather Here"];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate relative position of section inside the scroll space
      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        const scrolledAmount = viewportHeight - rect.top;
        setOffset(scrolledAmount * 0.18);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-espresso py-16 sm:py-24 md:py-32 border-b border-white/5 video-bg-section-alt"
    >
      <video className="section-bg-video pointer-events-none" autoPlay muted loop playsInline>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" type="video/mp4" />
      </video>

      <div className="section-video-overlay" />

      <div className="section-content w-full h-full">
        <div className="mb-14 text-center px-4">
          <span className="text-xs uppercase tracking-[0.28em] text-[#E2B77C] font-semibold block font-barlow animate-pulse">
            THE ART OF EXTRACTION
          </span>

          <h2 className="coffee-heading-gradient mt-4 text-[clamp(2.5rem,8vw,120px)] font-black uppercase leading-none tracking-tight">
            Coffee Moments
          </h2>
          <p className="text-beige/90 text-xs sm:text-sm mt-3 font-barlow max-w-md mx-auto leading-relaxed">
            Cinematic glances at bean roasting, slow-steep bars, and fresh morning rituals.
          </p>
        </div>

        {/* Row 1 - Moves Right */}
        <div className="flex flex-col gap-5">
          <div
            className="flex gap-4 transition-transform duration-100 ease-out"
            style={{
              transform: `translate3d(${offset - 250}px, 0px, 0px)`,
              willChange: "transform",
            }}
          >
            {/* Double elements to simulate seamless wrapping marquee */}
            {[...marqueeImagesRow1, ...marqueeImagesRow1, ...marqueeImagesRow1].map((src, index) => (
              <div
                key={`row1-${index}`}
                className="relative h-[220px] w-[320px] sm:h-[270px] sm:w-[420px] flex-none rounded-[28px] border border-white/10 overflow-hidden shadow-2xl group"
              >
                <SafeImage
                  src={src}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105 filter brightness-90 group-hover:brightness-100 animate-pulse"
                  alt="Guji Cafe moments"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-10 flex flex-col pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#E2B77C] font-semibold font-barlow">
                    GUJI CAFE
                  </span>
                  <span className="text-sm font-medium text-white tracking-wide mt-1">
                    {row1Captions[index % row1Captions.length]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Moves Left */}
          <div
            className="flex gap-4 transition-transform duration-100 ease-out mt-1"
            style={{
              transform: `translate3d(${-offset + 50}px, 0px, 0px)`,
              willChange: "transform",
            }}
          >
            {[...marqueeImagesRow2, ...marqueeImagesRow2, ...marqueeImagesRow2].map((src, index) => (
              <div
                key={`row2-${index}`}
                className="relative h-[220px] w-[320px] sm:h-[270px] sm:w-[420px] flex-none rounded-[28px] border border-white/10 overflow-hidden shadow-2xl group"
              >
                <SafeImage
                  src={src}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105 filter brightness-90 group-hover:brightness-100 animate-pulse"
                  alt="Artisanal coffee experience"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-10 flex flex-col pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#E2B77C] font-semibold font-barlow">
                    GUJI CAFE
                  </span>
                  <span className="text-sm font-medium text-white tracking-wide mt-1">
                    {row2Captions[index % row2Captions.length]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// INTERACTIVE HELPER 5: Sticky Stacking Coffee Cards Section
// -------------------------------------------------------------
const featuredCoffee = [
  {
    number: "01",
    category: "Signature Classics",
    title: "Guji Signature Latte",
    description: "A smooth espresso latte with creamy texture and a warm caramel finish.",
    button: "View Taste Profile",
    images: [
      "https://images.unsplash.com/photo-151097252790b-af4f42dfb14a?q=80&w=400&auto=format&fit=crop", // cup
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop", // beans bag
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop", // beans closeup
    ]
  },
  {
    number: "02",
    category: "Cold Foam Brew",
    title: "Iced Caramel Brew",
    description: "A refreshing iced coffee drink layered with rich caramel sweetness.",
    button: "View Taste Profile",
    images: [
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop", // warm cup art
      "https://images.unsplash.com/photo-1600431521340-491dea880813?q=80&w=400&auto=format&fit=crop", // croissant detail
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop", // coffee shop warm light
    ]
  },
  {
    number: "03",
    category: "Signature Reserve",
    title: "Mocha Cloud",
    description: "A bold chocolate coffee blend with velvety foam and a balanced finish.",
    button: "View Taste Profile",
    images: [
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400&auto=format&fit=crop", // filter coffee
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop", // steam kettle
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop", // barista slow bar
    ]
  }
];

interface StackCardProps {
  item: typeof featuredCoffee[number];
  index: number;
  total: number;
  onSelect: (title: string, desc: string) => void;
  key?: React.Key;
}

function CoffeeStackCard({ item, index, total, onSelect }: StackCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Measure scroll space for the card scale-down effect as we scroll over it
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.025;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div 
      ref={ref} 
      className="relative min-h-[80vh] sm:min-h-[85vh] mb-[8vh] flex items-start justify-center"
    >
      <motion.article
        style={{
          scale,
          top: `${88 + index * 24}px`,
        }}
        className="sticky w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#F7EFE5]/30 bg-[#100B08] p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Card Header area */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="flex items-end gap-3 sm:gap-5">
              <span className="coffee-heading-gradient text-6xl sm:text-7xl md:text-[100px] font-black leading-none font-serif-instrument italic">
                {item.number}
              </span>

              <div>
                <span className="block mb-1 sm:mb-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#E2B77C] font-barlow font-semibold">
                  {item.category}
                </span>

                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase leading-none tracking-tight text-[#F7EFE5] font-barlow">
                  {item.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => onSelect(item.title, item.description)}
              className="inline-flex w-fit items-center justify-center rounded-full border border-[#F7EFE5]/50 hover:border-light-caramel bg-white/5 hover:bg-cream hover:text-espresso px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7EFE5] transition duration-300 cursor-pointer"
            >
              {item.button}
            </button>
          </div>

          <p className="mb-6 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-[#D8C6B2] font-sans">
            {item.description}
          </p>
        </div>

        {/* Dynamic Multi-column Coffee Media Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-4 border-t border-white/5">
          <div className="overflow-hidden rounded-[24px] sm:rounded-[36px] h-[140px] sm:h-[180px]">
            <SafeImage
              src={item.images[0]}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="overflow-hidden rounded-[24px] sm:rounded-[36px] h-[140px] sm:h-[180px] hidden sm:block">
            <SafeImage
              src={item.images[1]}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="overflow-hidden rounded-[24px] sm:rounded-[36px] h-[140px] sm:h-[180px] col-span-1 md:col-span-2 lg:col-span-1">
            <SafeImage
              src={item.images[2]}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </div>

      </motion.article>
    </div>
  );
}

// -------------------------------------------------------------
// INTERACTIVE HELPER 6: Service Ritual List
// -------------------------------------------------------------
const ritualItems = [
  {
    number: "01",
    title: "Select",
    text: "We start with quality ingredients and carefully prepared coffee.",
  },
  {
    number: "02",
    title: "Brew",
    text: "Every cup is crafted for flavor, aroma, and consistency.",
  },
  {
    number: "03",
    title: "Serve",
    text: "Each drink is presented warm, fresh, and ready to enjoy.",
  },
  {
    number: "04",
    title: "Gather",
    text: "Guji Cafe is a space for connection, rest, and shared moments.",
  },
  {
    number: "05",
    title: "Enjoy",
    text: "Relax, sip, and enjoy the warm Guji Cafe atmosphere.",
  }
];

// ------------------------------------------------------------------
// MAIN FULL-FEATURE COFFEE SHOP APPLICATION
// ------------------------------------------------------------------
export default function App() {
  // -------------------- STATE VARIABLES --------------------
  // Ambient Sound & Video Controls
  const [videoOpacity, setVideoOpacity] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Reservation Form active inputs
  const [bookingDate, setBookingDate] = useState("2026-05-23");
  const [bookingTime, setBookingTime] = useState("09:00 AM");
  const [bookingGuests, setBookingGuests] = useState("2 Guests");
  const [bookingTableType, setBookingTableType] = useState("Slow Bar Corner Slot");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);

  // Active Menu Catalog Filter
  const [menuFilter, setMenuFilter] = useState<'all' | 'espresso' | 'filter' | 'sweet'>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [likedMenuItems, setLikedMenuItems] = useState<Record<string, boolean>>({});

  // Flavor Notes overlay panel state
  const [selectedProfileTitle, setSelectedProfileTitle] = useState<string | null>(null);
  const [selectedProfileDesc, setSelectedProfileDesc] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync background video element state correctly
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.info("Autoplay browser audio policies bypassed successfully", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingEmail.trim()) {
      alert("Please fill in your name and email to proceed with reservation.");
      return;
    }
    setBookingComplete(true);
  };

  const resetBookingForm = () => {
    setBookingName("");
    setBookingEmail("");
    setBookingPhone("");
    setBookingComplete(false);
  };

  const toggleLikeMenu = (name: string) => {
    setLikedMenuItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Luxury Coffee Catalog
  const menuItems = [
    {
      id: 'guji-signature-latte',
      name: 'Guji Signature Latte',
      category: 'espresso',
      description: 'A smooth espresso latte with creamy texture and a warm caramel finish.',
      price: '₱165',
      badge: 'Best Seller',
      rating: 4.9,
      icon: '☕'
    },
    {
      id: 'iced-caramel-brew',
      name: 'Iced Caramel Brew',
      category: 'espresso',
      description: 'A refreshing iced coffee drink layered with rich caramel sweetness.',
      price: '₱175',
      badge: 'Cold Brew Classic',
      rating: 5.0,
      icon: '🍯'
    },
    {
      id: 'mocha-cloud',
      name: 'Mocha Cloud',
      category: 'sweet',
      description: 'A bold chocolate coffee blend with velvety foam and a balanced finish.',
      price: '₱180',
      badge: 'Velvet Foam',
      rating: 4.8,
      icon: '☁️'
    },
    {
      id: 'vanilla-cold-brew',
      name: 'Vanilla Cold Brew',
      category: 'filter',
      description: 'Single-origin washed beans slow-steeped in cold water. Crowned with clean floats of vanilla bean.',
      price: '₱170',
      badge: 'Slow Steeped',
      rating: 4.8,
      icon: '❄️'
    },
    {
      id: 'croissant',
      name: 'Croissant',
      category: 'sweet',
      description: 'A golden-baked crispy French croissant with rich buttery layers.',
      price: '₱95',
      badge: 'Baked Daily',
      rating: 4.9,
      icon: '🥐'
    },
    {
      id: 'chocolate-cake',
      name: 'Chocolate Cake Slice',
      category: 'sweet',
      description: 'A rich, moist dark chocolate cake slice with velvety fudge layering.',
      price: '₱140',
      badge: 'Patisserie Special',
      rating: 5.0,
      icon: '🍫'
    }
  ];

  // Search filter computes
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = menuFilter === 'all' || item.category === menuFilter;
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative w-full min-h-screen bg-espresso text-cream overflow-hidden antialiased">
      
      {/* -------------------------------------------------------------
          2. FIXED LIQUID-GLASS NAVBAR
          ------------------------------------------------------------- */}
      <nav 
        id="premium-fixed-navbar"
        className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 w-full max-w-[1440px] mx-auto transition-all duration-300"
      >
        {/* Left: 48x48px circular liquid glass logo */}
        <a 
          href="#home"
          className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center hover:scale-[1.04] transition-all duration-300 shadow-md group border border-white/5"
          style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.14)" }}
        >
          <span className="font-serif-instrument italic text-[30px] leading-none text-cream group-hover:text-light-caramel transition-colors">
            G
          </span>
        </a>

        {/* Center navigation pill */}
        <div 
          id="navbar-center-pill" 
          className="hidden md:flex items-center gap-1 liquid-glass p-1.5 rounded-full shadow-lg border border-white/5"
        >
          <a 
            href="#home" 
            className="px-3.5 py-2 text-[14px] font-medium font-barlow text-white/90 hover:text-light-caramel tracking-wide transition-all duration-200"
          >
            Home
          </a>
          <a 
            href="#menu" 
            className="px-3.5 py-2 text-[14px] font-medium font-barlow text-white/90 hover:text-light-caramel tracking-wide transition-all duration-200"
          >
            Menu
          </a>
          <a 
            href="#branches" 
            className="px-3.5 py-2 text-[14px] font-medium font-barlow text-white/90 hover:text-light-caramel tracking-wide transition-all duration-200"
          >
            Branches
          </a>
          <a 
            href="#story" 
            className="px-3.5 py-2 text-[14px] font-medium font-barlow text-white/90 hover:text-light-caramel tracking-wide transition-all duration-200"
          >
            About
          </a>
          <a 
            href="#visit" 
            className="px-3.5 py-2 text-[14px] font-medium font-barlow text-white/90 hover:text-light-caramel tracking-wide transition-all duration-200 mr-2"
          >
            Visit
          </a>

          {/* Reserve CTA button in the center nav glass pill */}
          <a 
            href="#branches"
            className="bg-cream text-espresso text-[14px] font-semibold font-barlow px-4 py-2 rounded-full hover:bg-light-caramel hover:scale-[1.02] active:scale-95 transition-all duration-200 whitespace-nowrap shadow-md cursor-pointer inline-flex items-center gap-1"
          >
            Find a Branch &rarr;
          </a>
        </div>

        {/* Right balance spacer */}
        <div className="w-12 h-12 invisible hidden md:block" aria-hidden="true" />

        {/* Mobile menu sticky fallback button */}
        <div className="md:hidden">
          <a 
            href="#branches"
            className="px-4 py-2 rounded-full liquid-glass text-xs font-semibold font-barlow text-light-caramel border border-[#E2B77C]/25 hover:bg-white/10 transition-colors"
          >
            Find a Branch
          </a>
        </div>
      </nav>

      {/* -------------------------------------------------------------
          3. HERO SECTION - CINEMATIC AMBIENCE
          ------------------------------------------------------------- */}
      <section 
        id="home" 
        className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between bg-espresso pointer-events-auto"
      >
        {/* Absolute Cinematic Looping Hero Background */}
        <CinematicHeroBackground
          isPlaying={isPlaying}
          isMuted={isMuted}
          opacity={videoOpacity}
        />

        {/* Overlay premium linear gradient & soft center ambient light */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-espresso pointer-events-none z-10" />
        <div className="absolute inset-0 bg-radial-gradient-center from-caramel/8 via-transparent to-transparent pointer-events-none z-10" />

        {/* Main Content Container centered */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center flex-grow pt-[140px] md:pt-[160px] pb-32">
          
          <div className="text-center">
            {/* Elegant upper subtitle eyebrow */}
            <span className="inline-block text-light-caramel text-xs tracking-[0.28em] font-semibold uppercase mb-6 font-barlow">
              GUJI CAFE
            </span>

            {/* Luxury Responsive Headline */}
            <h1 className="max-w-[1000px] text-cream font-barlow font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.92] tracking-tight">
              Where Every Sip<br />
              is <em className="font-serif-instrument italic text-light-caramel font-normal normal-case">Guji-licious.</em>
            </h1>

            {/* Explanatory Paragraph */}
            <p className="max-w-[560px] mx-auto mt-7 text-beige font-sans text-sm sm:text-base md:text-lg leading-[1.7]">
              Guji Cafe is your cozy destination for rich coffee, warm conversations, and relaxing café moments — crafted for people who love flavor, comfort, and atmosphere.
            </p>

            {/* Dual Actions with stationary premium buttons */}
            <div className="flex justify-center items-center gap-4 mt-9 flex-wrap">
              <a 
                href="#menu" 
                className="px-7 py-3.5 rounded-full bg-cream text-espresso text-sm font-semibold tracking-wide hover:scale-105 hover:bg-light-caramel active:scale-95 transition-all shadow-lg animate-pulse"
              >
                Explore Menu
              </a>
              
              <a 
                href="#branches" 
                className="px-7 py-3.5 rounded-full liquid-glass border border-white/20 text-cream text-sm font-semibold tracking-wide hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-lg pointer-events-auto cursor-pointer"
              >
                Find a Branch
              </a>
            </div>
          </div>
        </div>

        {/* Floating bottom-left luxury information glass board */}
        <div 
          id="hero-bottom-left-card"
          className="absolute z-20 bottom-8 left-6 right-6 sm:left-8 md:left-12 lg:left-16 sm:right-auto max-w-[360px]"
        >
          <div className="p-6 rounded-[28px] shadow-2xl bg-black/60 backdrop-blur-2xl text-cream border border-white/10 hover:border-light-caramel/30 transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-light-caramel font-barlow">
                ☕ OPEN DAILY
              </span>
              <span className="text-[11px] font-semibold text-cream bg-white/5 px-2 py-0.5 rounded-md font-mono">
                9:00 AM — 12:00 AM
              </span>
            </div>

            <p className="text-xs sm:text-[13px] leading-relaxed text-beige/85 mb-3">
              Visit any of our Guji Cafe branches in San Fernando City, Balaoan, and Tagudin.
            </p>

            <a 
              href="#branches" 
              className="inline-flex items-center gap-1 text-[11px] font-bold text-light-caramel uppercase tracking-widest hover:text-white transition-colors"
            >
              <span>Find us nearby</span>
              <ArrowRight size={11} className="animate-pulse" />
            </a>
          </div>
        </div>

        {/* Ambient video & audio control pad at bottom-right corner */}
        <div className="absolute right-6 bottom-8 z-20 flex items-center gap-2">
          {/* Mute audio button */}
          <button 
            onClick={toggleMute}
            title={isMuted ? "Unmute warm cafe soundscape" : "Mute audio focus tracks"}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-[#1B120D] text-light-caramel hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
          </button>
          
          {/* Play pause scene button */}
          <button 
            onClick={togglePlay}
            title={isPlaying ? "Pause background cinema stream" : "Resume scene streams"}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-[#1B120D] text-light-caramel hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. COFFEE MOMENTS MARQUEE SECTION
          ------------------------------------------------------------- */}
      <CoffeeMarquee />

      {/* -------------------------------------------------------------
          5. FEATURED COFFEE COFFEES (STICKY STACKED DECK)
          ------------------------------------------------------------- */}
      <section className="relative z-10 bg-espresso px-5 py-20 pb-32 sm:py-24 md:py-32 border-b border-white/5 overflow-visible">
        <div className="mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-[#E2B77C] font-semibold block font-barlow">
            RESERVE CROPS
          </span>

          <h2 className="coffee-heading-gradient mt-4 text-[clamp(2.5rem,8vw,120px)] font-black uppercase leading-none tracking-tight">
            Featured Coffee
          </h2>
          <p className="text-beige/60 text-xs sm:text-sm mt-3 font-barlow max-w-md mx-auto">
            Three exquisite coffees roasted and poured with distinct regional notes. Scroll to explore step-by-step profiles.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {featuredCoffee.map((item, index) => (
            <CoffeeStackCard
              key={item.title}
              item={item}
              index={index}
              total={featuredCoffee.length}
              onSelect={(title, desc) => {
                setSelectedProfileTitle(title);
                setSelectedProfileDesc(desc);
              }}
            />
          ))}
        </div>
      </section>

      {/* Specialty taste overlay popup card */}
      <AnimatePresence>
        {selectedProfileTitle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-[#1B120D] border-2 border-light-caramel/30 rounded-[32px] p-8 max-w-md w-full text-center relative shadow-3xl"
            >
              <span className="text-[10px] tracking-widest text-[#E2B77C] uppercase font-mono block mb-2">
                Aromatics Assessment
              </span>
              <h4 className="text-2xl font-serif-instrument italic text-[#F7EFE5] mb-4">
                {selectedProfileTitle}
              </h4>
              <p className="text-[#D8C6B2] text-sm leading-relaxed mb-6">
                {selectedProfileDesc}
              </p>
              
              <div className="bg-white/5 p-4 rounded-2xl mb-6 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-muted">Aroma Intensity:</span>
                  <span className="text-light-caramel">9.8 // Exceptional</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-muted">Acidity Brightness:</span>
                  <span className="text-light-caramel">Balanced Softness</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Roast Point:</span>
                  <span className="text-light-caramel">Light-Medium Air-dried</span>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedProfileTitle(null); setSelectedProfileDesc(null); }}
                className="w-full bg-cream hover:bg-light-caramel text-espresso font-semibold py-3 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          5.5. DYNAMIC COFFEE MOMENT TRANSITION STRIP (VIDEO ACCENT)
          ------------------------------------------------------------- */}
      <section className="relative w-full h-[300px] sm:h-[400px] overflow-hidden flex items-center justify-center border-t border-b border-white/5 bg-[#100B08]">
        <video 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 z-0" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_110052_2e127257-5236-40b1-ba48-4690260f1185.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#100B08] via-transparent to-[#100B08]/85 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-espresso/50 pointer-events-none z-0" />
        
        <div className="relative z-10 text-center space-y-3 px-6 max-w-xl">
          <span className="text-[10px] tracking-[0.3em] font-bold text-[#E2B77C] font-mono uppercase block">
            ATMOSPHERIC SENSORY
          </span>
          <h3 className="text-2xl sm:text-4xl font-display font-medium text-[#F7EFE5] leading-tight tracking-tight">
            Crafted for slow mornings & warm catch-ups.
          </h3>
          <p className="text-beige/80 text-xs font-sans max-w-sm mx-auto">
            Experience the soothing stream of pure, artisanal specialty extraction.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. THE GUJI EXPERIENCE - SOLID DECO BACKDROP
          ------------------------------------------------------------- */}
      <section className="px-6 py-20 text-[#100B08] sm:py-24 md:py-32 rounded-t-[50px] sm:rounded-t-[60px] relative z-20 overflow-hidden bg-[#F7EFE5]">
        <video 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.14] z-0" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-[#F7EFE5]/92 pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto">
          
          <FadeIn>
            <h2 className="mb-14 sm:mb-20 text-center text-[clamp(2.5rem,8vw,120px)] font-black uppercase leading-none tracking-tight text-[#100B08]">
              The Guji Experience
            </h2>
          </FadeIn>

          <div className="space-y-4">
            {ritualItems.map((item, index) => (
              <FadeIn key={item.number} delay={index * 0.08}>
                <article className="grid gap-6 border-t border-[#100B08]/15 py-8 sm:py-10 md:grid-cols-[0.25fr_0.75fr] md:py-12 hover:bg-black/5 px-4 transition-colors duration-300 rounded-3xl">
                  {/* Left Column large number */}
                  <span className="text-[clamp(3.5rem,9vw,110px)] font-black leading-none font-serif-instrument italic text-[#C8915B]">
                    {item.number}
                  </span>

                  {/* Right Column details */}
                  <div>
                    <h3 className="mb-3 text-[clamp(1.1rem,2vw,1.8rem)] font-bold uppercase tracking-wide text-[#100B08] font-barlow flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-caramel block" />
                      <span>{item.title}</span>
                    </h3>

                    <p className="text-sm sm:text-base text-[#100B08]/85 font-sans leading-relaxed font-light">
                      {item.text}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          7. OUR STORY (CHARACTER-BY-CHARACTER REVEAL TEXT ON SCROLL)
          ------------------------------------------------------------- */}
      <section 
        id="story" 
        className="relative py-24 sm:py-32 px-6 bg-coffee rounded-t-[50px] sm:rounded-t-[60px] -mt-10 z-25 border-t border-white/5 overflow-hidden"
      >
        <video 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20 z-0" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_110052_2e127257-5236-40b1-ba48-4690260f1185.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-[#100B08]/65 pointer-events-none z-0" />

        {/* Floating absolute subtle SVGs representation of coffee branch */}
        <div className="absolute top-12 left-10 opacity-15 pointer-events-none hidden lg:block animate-pulse z-10">
          <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 180C70 150 120 120 180 20" stroke="#E2B77C" strokeWidth="2" strokeDasharray="6 6"/>
            <circle cx="50" cy="150" r="10" fill="#E2B77C" />
            <circle cx="100" cy="110" r="12" fill="#E2B77C" />
            <circle cx="150" cy="60" r="8" fill="#E2B77C" />
          </svg>
        </div>

        <div className="absolute bottom-16 right-10 opacity-15 pointer-events-none hidden lg:block z-10">
          <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10C80 40 120 120 190 190" stroke="#E2B77C" strokeWidth="2"/>
            <path d="M70 50C90 70 100 110 110 160" stroke="#C8915B" strokeWidth="1.5"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-4">
          <span className="text-light-caramel text-xs tracking-[0.28em] font-semibold uppercase block font-barlow">
            ABOUT GUJI CAFE
          </span>

          <FadeIn>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium text-cream leading-tight title-tracking max-w-3xl mx-auto">
              Coffee, comfort, and <em className="font-serif-instrument italic text-light-caramel font-normal normal-case">community.</em>
            </h2>
          </FadeIn>

          <FadeIn>
            <p className="max-w-[700px] mx-auto text-beige/85 text-sm sm:text-base leading-relaxed">
              Guji Cafe is a welcoming coffee destination made for relaxed mornings, catch-ups with friends, and everyday coffee rituals. Every branch is designed to feel inviting, stylish, and warm — a place where every cup adds to the experience.
            </p>
          </FadeIn>

          {/* Interactive Character Reveal text component on scroll */}
          <div className="py-10">
            <AnimatedText 
              text="Guji Cafe is a cozy place for people who love the ritual of coffee. Every drink is prepared with care, every visit feels warm, and every branch is made for good moments with friends, family, and community."
              className="mx-auto max-w-[760px] text-center text-xl sm:text-2xl leading-relaxed text-[#F7EFE5]"
            />
          </div>

          {/* Stately Brand characteristics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 text-left">
            <div className="p-6 rounded-[28px] bg-espresso/50 border border-white/5 space-y-3">
              <span className="text-xs font-mono text-light-caramel font-bold">01 // FAIR TRADE ACTS</span>
              <h5 className="text-lg font-semibold text-cream">Direct Coffee Estate Sourcing</h5>
              <p className="text-xs sm:text-sm text-beige/80 leading-relaxed">
                By purchasing cherries directly from independent family gardens, we ensure premium quality payouts 80% higher than global fair-trade standards.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-espresso/50 border border-white/5 space-y-3">
              <span className="text-xs font-mono text-light-caramel font-bold">02 // CHEMICAL FREE</span>
              <h5 className="text-lg font-semibold text-cream">No-Carbon Air Drum Roasts</h5>
              <p className="text-xs sm:text-sm text-beige/80 leading-relaxed">
                Our roasting implements use state-of-the-art particulate filters operating on renewable power, keeping output clean and free from oil residue.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-espresso/50 border border-white/5 space-y-3">
              <span className="text-xs font-mono text-light-caramel font-bold">03 // INTENTIONAL DESIGN</span>
              <h5 className="text-lg font-semibold text-cream">Quiet Architectural Havens</h5>
              <p className="text-xs sm:text-sm text-beige/80 leading-relaxed">
                Our cafe bars are designed with textured earth plasters and walnut acoustics to naturally trap outside clamor, letting you isolate in complete peace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          8. ABOUT / STORY PORTFOLIO GRID & IMAGES
          ------------------------------------------------------------- */}
      <section className="bg-espresso px-6 py-20 relative overflow-hidden border-b border-white/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Image 1: Barista */}
            <div className="group rounded-[32px] overflow-hidden bg-[#1B120D] shadow-xl relative h-[380px]">
              <SafeImage 
                src={IMAGES.baristaStory} 
                alt="Barista weighing standard extraction" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-x-0 bottom-0 py-6 px-6 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end text-left select-none">
                <span className="text-[10px] text-light-caramel font-mono mb-1 tracking-widest font-bold">METICULOUS MASS</span>
                <span className="text-lg font-semibold text-cream">Artisanal Extraction</span>
                <p className="text-xs text-beige/80 mt-1">Weighing water, grams, and flow variables perfectly.</p>
              </div>
            </div>

            {/* Image 2: Beans */}
            <div className="group rounded-[32px] overflow-hidden bg-[#1B120D] shadow-xl relative h-[380px]">
              <SafeImage 
                src={IMAGES.beansStory} 
                alt="Finely processed specialty coffee beans" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-x-0 bottom-0 py-6 px-6 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end text-left select-none">
                <span className="text-[10px] text-light-caramel font-mono mb-1 tracking-widest font-bold">THE HIGHLANDS</span>
                <span className="text-lg font-semibold text-cream">Heirloom Handpicked</span>
                <p className="text-xs text-beige/80 mt-1">Sourced from small high-altitude shade dry garden beds.</p>
              </div>
            </div>

            {/* Image 3: Interior space */}
            <div className="group rounded-[32px] overflow-hidden bg-[#1B120D] shadow-xl relative h-[380px] col-span-1 md:col-span-2 lg:col-span-1">
              <SafeImage 
                src={IMAGES.interiorStory} 
                alt="Premium minimal stone espresso shop layout" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-x-0 bottom-0 py-6 px-6 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end text-left select-none">
                <span className="text-[10px] text-light-caramel font-mono mb-1 tracking-widest font-bold">NATURAL SANCTUARY</span>
                <span className="text-lg font-semibold text-cream">Slow Down Rest Spaces</span>
                <p className="text-xs text-beige/80 mt-1">Double insulated oak rooms for absolute silence.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          9. SIGNATURE ROAST FEATURES & RADIAL GLOW CARD
          ------------------------------------------------------------- */}
      <section className="relative py-24 sm:py-32 px-6 bg-coffee">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <span className="text-light-caramel text-xs tracking-[0.28em] font-semibold uppercase block font-barlow">
              Aroma Profiling
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-cream leading-tight tracking-tight select-text">
              A deeper roast with a <em className="font-serif-instrument italic text-light-caramel font-normal normal-case animate-pulse">softer finish.</em>
            </h2>
            <p className="text-beige text-base sm:text-lg leading-relaxed max-w-[540px] select-text">
              Our house blend is roasted in small batches for notes of dark chocolate, toasted almond, brown sugar, and a smooth caramel finish. We sample each crop daily to lock in balance and preserve high-extraction complexity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <CoffeeIcon size={18} className="text-light-caramel" />
                <span className="text-xs uppercase tracking-wider text-cream font-semibold">Small Batch</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Sparkles size={18} className="text-light-caramel" />
                <span className="text-xs uppercase tracking-wider text-cream font-semibold">Single Origin</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Award size={18} className="text-light-caramel" />
                <span className="text-xs uppercase tracking-wider text-cream font-semibold">Slow Roasted</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Clock size={18} className="text-light-caramel" />
                <span className="text-xs uppercase tracking-wider text-cream font-semibold">Fresh Daily</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            {/* Soft radial caramel glow behind content */}
            <div className="absolute inset-x-12 top-10 bottom-10 bg-caramel/15 blur-3xl rounded-full" />
            
            <div className="relative z-10 p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-3xl overflow-hidden hover:translate-y-[-4px] transition-transform duration-300">
              <SafeImage 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop" 
                alt="Signature beans pack" 
                className="w-full h-[320px] object-cover rounded-[24px] mb-6 filter brightness-95"
              />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E2B77C] block mb-1">SELECTED CROP</span>
                  <h4 className="text-lg font-bold text-cream">El Injerto Bourbon Reserve</h4>
                </div>
                <div className="px-3 py-1 bg-caramel/20 border border-caramel/30 rounded-full text-[#E2B77C] text-xs">
                  Slow Bar Blend
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          10. MENU PREVIEW SECTION WITH DYNAMIC BOOKMARKS
          ------------------------------------------------------------- */}
      <section 
        id="menu" 
        className="w-full py-24 sm:py-32 px-6 sm:px-12 bg-mocha relative border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-light-caramel text-xs tracking-[0.28em] font-semibold uppercase block font-barlow">
              MENU HIGHLIGHTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-cream leading-tight tracking-tight select-text">
              A menu worth coming back for.
            </h2>
            <p className="text-beige/95 text-xs sm:text-sm max-w-md mx-auto">
              Prepared meticulously to order using our house specialty blend or organic guest micro-lots. Check ingredients.
            </p>
          </div>

          {/* Interactive filter controls & search triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-y border-white/5 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {[
                { key: 'all', label: 'All Rituals' },
                { key: 'espresso', label: 'Espresso Bar' },
                { key: 'filter', label: 'Slow Bar' },
                { key: 'sweet', label: 'Boulangerie' }
              ].map((cat) => (
                <button 
                  key={cat.key}
                  onClick={() => setMenuFilter(cat.key as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase font-barlow transition-colors duration-200 cursor-pointer ${
                    menuFilter === cat.key ? 'bg-cream text-espresso' : 'bg-white/5 hover:bg-white/10 text-cream'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Custom search state trigger */}
            <div className="relative w-full sm:w-[220px]">
              <input 
                type="text" 
                placeholder="Search menu items..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full bg-white/5 hover:bg-white/10 focus:bg-espresso border border-white/10 rounded-full px-4 py-1.5 text-xs text-cream focus:outline-none focus:border-light-caramel transition-all"
              />
              <Search className="absolute right-3.5 top-2 text-muted" size={13} />
            </div>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            <AnimatePresence mode="popLayout">
              {filteredMenuItems.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="p-6 sm:p-8 rounded-[28px] liquid-glass border border-white/10 hover:border-light-caramel/20 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 relative group h-[250px]"
                >
                  {/* Dynamic heart list toggles */}
                  <button 
                    onClick={() => toggleLikeMenu(item.name)}
                    className="absolute top-6 right-6 text-muted hover:text-rose-400 transition-colors cursor-pointer z-10"
                    title="Bookmark Item"
                  >
                    <Heart size={16} className={likedMenuItems[item.name] ? 'fill-rose-400 text-rose-400' : 'text-muted/60'} />
                  </button>

                  <div>
                    {/* Header tags */}
                    <div className="flex items-center gap-2 mb-2 pr-6 select-none">
                      <span className="text-[10px] text-light-caramel font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {item.badge}
                      </span>
                      <div className="flex items-center gap-0.5 text-xs text-light-caramel">
                        <Star size={11} className="fill-light-caramel text-light-caramel" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-cream group-hover:text-light-caramel transition-colors flex items-center gap-2">
                      <span className="opacity-80 text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </h3>

                    <p className="text-xs text-beige/85 leading-relaxed mt-2.5 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <span className="text-lg font-serif-instrument italic text-light-caramel font-bold">
                      {item.price}
                    </span>
                    <button 
                      onClick={() => alert(`Pre-selection done! Your cup of ${item.name} is noted for your next visit.`)}
                      className="text-[11px] font-mono tracking-wider uppercase text-light-caramel hover:text-white flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <span>Pre-Order</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12 text-muted">
              <p>No artisanal selections found matching "{menuSearch}".</p>
              <button 
                onClick={() => { setMenuSearch(''); setMenuFilter('all'); }} 
                className="mt-4 text-xs font-semibold hover:underline text-light-caramel"
              >
                Clear filter query
              </button>
            </div>
          )}

          {/* PDF menu trigger or dynamic prompt */}
          <div className="text-center pt-8">
            <button 
              onClick={() => alert("Guji Cafe menu selection will show in modern interactive guides.")}
              className="px-8 py-3.5 rounded-full bg-cream text-espresso text-sm font-semibold hover:bg-light-caramel transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>View Full Menu</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          11. SOCIAL PROOF & EDITORIAL REVIEWS
          ------------------------------------------------------------- */}
      <section className="bg-coffee px-6 py-24 sm:py-32 relative text-center border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <span className="text-light-caramel text-xs tracking-[0.28em] font-semibold uppercase block font-barlow">
              COMMUNITY VOICE
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-cream leading-tight tracking-tight select-text">
              Loved by people who stay for another cup.
            </h2>
          </div>

          {/* Review grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-6">
            
            {/* Review 1 */}
            <div className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-light-caramel/20 backdrop-blur-md flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
              <p className="text-sm sm:text-base text-beige italic leading-relaxed font-sans select-text">
                &ldquo;The atmosphere is cozy, the drinks are great, and it’s a perfect place to relax.&rdquo;
              </p>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-cream text-sm">Customer Review</span>
                  <span className="text-[10px] text-muted uppercase font-mono">Verified Patron</span>
                </div>
                <div className="flex text-light-caramel">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-light-caramel" />)}
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-light-caramel/20 backdrop-blur-md flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
              <p className="text-sm sm:text-base text-beige italic leading-relaxed font-sans select-text">
                &ldquo;Guji Cafe has a warm feel and really good coffee. Definitely worth visiting.&rdquo;
              </p>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-cream text-sm">Customer Review</span>
                  <span className="text-[10px] text-muted uppercase font-mono">Regular Guest</span>
                </div>
                <div className="flex text-light-caramel">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-light-caramel" />)}
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-light-caramel/20 backdrop-blur-md flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
              <p className="text-sm sm:text-base text-beige italic leading-relaxed font-sans select-text">
                &ldquo;Nice place to unwind with friends and enjoy a good cup of coffee.&rdquo;
              </p>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-cream text-sm">Customer Review</span>
                  <span className="text-[10px] text-muted uppercase font-mono">Local Guide</span>
                </div>
                <div className="flex text-light-caramel">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-light-caramel" />)}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          11.5. BRANCHES / LOCATIONS SECTION
          ------------------------------------------------------------- */}
      <section 
        id="branches" 
        className="w-full py-24 sm:py-32 px-6 sm:px-12 bg-espresso relative border-t border-white/5 overflow-hidden"
      >
        <video 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20 z-0" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_110052_2e127257-5236-40b1-ba48-4690260f1185.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-[#100B08]/70 pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-light-caramel text-xs tracking-[0.28em] font-semibold uppercase block font-barlow">
              OUR BRANCHES
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-medium text-cream leading-tight tracking-tight select-text">
              Find a Guji Near You
            </h2>
            <p className="text-beige/95 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Visit your nearest Guji Cafe branch for coffee, comfort, and good moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Branch 1 */}
            <div className="group rounded-[36px] bg-[#100B08] p-8 border border-white/10 hover:border-light-caramel/25 shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-caramel/10 border border-caramel/20 flex items-center justify-center text-light-caramel">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cream font-barlow uppercase tracking-wide">
                    San Fernando
                  </h3>
                  <p className="text-[11px] text-light-caramel font-semibold uppercase tracking-wider font-mono mt-1">
                    Guji Cafe
                  </p>
                </div>
                <div className="space-y-3.5 text-xs text-beige/80 font-sans pt-4 border-t border-white/5">
                  <div className="flex gap-2.5">
                    <MapPin size={15} className="text-[#E2B77C] flex-shrink-0 mt-0.5" />
                    <span>J8W6+697, San Fernando City, La Union, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-[#E2B77C]" />
                    <span>+63 969 492 6689</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-[#E2B77C]" />
                    <span>Open Daily · 9:00 AM – 12:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Map embed / preview */}
              <div className="mt-6 rounded-2xl overflow-hidden h-[180px] bg-white/5 border border-white/10 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15291.603348165609!2d120.316827!3d16.618621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33918f50cddbbf51%3A0xe54e6015bc23ef4a!2sSan%20Fernando%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1716350000000!5m2!1sen!2sph"
                  className="w-full h-full border-0 grayscale invert opacity-70 hover:opacity-95 transition-opacity"
                  loading="lazy"
                  title="Guji Cafe — San Fernando Map"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-6">
                <a 
                  href="https://maps.app.goo.gl/BESeSptoV7ss82dKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-cream hover:bg-light-caramel text-espresso text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="group rounded-[36px] bg-[#100B08] p-8 border border-white/10 hover:border-light-caramel/25 shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-caramel/10 border border-caramel/20 flex items-center justify-center text-light-caramel">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cream font-barlow uppercase tracking-wide">
                    Balaoan
                  </h3>
                  <p className="text-[11px] text-light-caramel font-semibold uppercase tracking-wider font-mono mt-1">
                    Guji Cafe
                  </p>
                </div>
                <div className="space-y-3.5 text-xs text-beige/80 font-sans pt-4 border-t border-white/5">
                  <div className="flex gap-2.5">
                    <MapPin size={15} className="text-[#E2B77C] flex-shrink-0 mt-0.5" />
                    <span>RCF3+58H, Balaoan, La Union, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-[#E2B77C]" />
                    <span>+63 991 974 6276</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-[#E2B77C]" />
                    <span>Open Daily · 9:00 AM – 12:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Map embed / preview */}
              <div className="mt-6 rounded-2xl overflow-hidden h-[180px] bg-white/5 border border-white/10 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.112260273822!2d120.4042835!3d16.8239019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339169b0fa658d55%3A0x6bffd40ac6cb28df!2sBalaoan%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1716350001000!5m2!1sen!2sph"
                  className="w-full h-full border-0 grayscale invert opacity-70 hover:opacity-95 transition-opacity"
                  loading="lazy"
                  title="Guji Cafe — Balaoan Map"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-6">
                <a 
                  href="https://maps.app.goo.gl/MaFiY8symLv9uq1K9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-cream hover:bg-light-caramel text-espresso text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Branch 3 */}
            <div className="group rounded-[36px] bg-[#100B08] p-8 border border-white/10 hover:border-light-caramel/25 shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-caramel/10 border border-caramel/20 flex items-center justify-center text-light-caramel">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cream font-barlow uppercase tracking-wide">
                    Tagudin
                  </h3>
                  <p className="text-[11px] text-light-caramel font-semibold uppercase tracking-wider font-mono mt-1">
                    Guji Cafe
                  </p>
                </div>
                <div className="space-y-3.5 text-xs text-beige/80 font-sans pt-4 border-t border-white/5">
                  <div className="flex gap-2.5">
                    <MapPin size={15} className="text-[#E2B77C] flex-shrink-0 mt-0.5" />
                    <span>Brgy. Rizal, Tagudin, 2720 Ilocos Sur, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-[#E2B77C]" />
                    <span>+63 951 094 0309</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-[#E2B77C]" />
                    <span>Open Daily · 9:00 AM – 12:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Map embed / preview */}
              <div className="mt-6 rounded-2xl overflow-hidden h-[180px] bg-white/5 border border-white/10 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15220.17765103445!2d120.444747!3d16.941324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339167389868846b%3A0x1d7c3bcbb6c49cc8!2sTagudin%2C%20Ilocos%20Sur!5e0!3m2!1sen!2sph!4v1716350002000!5m2!1sen!2sph"
                  className="w-full h-full border-0 grayscale invert opacity-70 hover:opacity-95 transition-opacity"
                  loading="lazy"
                  title="Guji Cafe — Tagudin Map"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-6">
                <a 
                  href="https://maps.app.goo.gl/4E4WrYjTiRMbr1vo6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-cream hover:bg-light-caramel text-espresso text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          12. VISIT / ACTIVE RESERVATION CTA SECTION
          ------------------------------------------------------------- */}
      <section 
        id="visit" 
        className="relative min-h-[90vh] py-24 sm:py-32 px-6 bg-espresso border-t border-white/5 flex items-center justify-center rounded-t-[50px] sm:rounded-t-[60px] overflow-hidden video-bg-section-alt cta-section"
      >
        {/* Reservation Media backdrop */}
        <video 
          className="section-bg-video pointer-events-none" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="section-video-overlay" />

        <div className="section-content relative z-10 max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center border border-[#E2B77C]/20 text-light-caramel select-none">
              <span className="font-serif-instrument italic text-3xl">G</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-medium text-cream leading-tight title-tracking select-text">
              See you at Guji Cafe.
            </h2>

            <p className="text-beige text-base leading-relaxed">
              Drop by your nearest Guji branch and enjoy rich coffee, cozy interiors, and a café experience made for everyday moments.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="#branches"
                className="px-6 py-3 rounded-full bg-cream text-espresso text-xs font-bold uppercase tracking-wider hover:bg-light-caramel transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                Find a Branch
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61561855393566"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-cream text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Open Facebook Page</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Quick specifications bullets */}
            <div className="space-y-3 font-mono text-xs text-light-caramel pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel block" />
                <span>📍 San Fernando · Balaoan · Tagudin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel block" />
                <span>⏰ Open Daily · 9:00 AM – 12:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel block" />
                <span>📞 Contact branch for quick table answers</span>
              </div>
            </div>
          </div>

          {/* Interactive Input Form Card */}
          <div className="p-8 rounded-[36px] bg-[#100B08] border border-white/10 shadow-3xl">
            <h3 className="text-xl font-bold text-cream mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-light-caramel" />
              <span>Reserve a Table Spot</span>
            </h3>

            <AnimatePresence mode="wait">
              {!bookingComplete ? (
                <motion.form 
                  key="booking-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleBookingSubmit}
                  className="space-y-4 text-xs font-barlow"
                >
                  {/* Row 1 Date & Time inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Pick Date</label>
                      <input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-light-caramel focus:outline-none rounded-xl px-3 py-2 text-cream"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Select Time Slot</label>
                      <select 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-[#1B120D] border border-white/10 focus:border-light-caramel focus:outline-none rounded-xl px-3 py-2 text-cream"
                      >
                        <option value="09:00 AM">09:00 AM // Morning Brew</option>
                        <option value="12:00 PM">12:00 PM // Noontime Comfort</option>
                        <option value="03:00 PM">03:00 PM // Afternoon Relax</option>
                        <option value="06:00 PM">06:00 PM // Twilight Coffee</option>
                        <option value="09:00 PM">09:00 PM // Late Night Warmth</option>
                        <option value="11:30 PM">11:30 PM // Siphon & Chats</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2 Zone & Guests count */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Our Branch Area</label>
                      <select 
                        value={bookingTableType}
                        onChange={(e) => setBookingTableType(e.target.value)}
                        className="w-full bg-[#1B120D] border border-white/10 focus:border-light-caramel focus:outline-none rounded-xl px-3 py-2 text-cream"
                      >
                        <option value="Guji Cafe — San Fernando">San Fernando Branch</option>
                        <option value="Guji Cafe — Balaoan">Balaoan Branch</option>
                        <option value="Guji Cafe — Tagudin">Tagudin Branch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Guests Size</label>
                      <select 
                        value={bookingGuests}
                        onChange={(e) => setBookingGuests(e.target.value)}
                        className="w-full bg-[#1B120D] border border-white/10 focus:border-light-caramel focus:outline-none rounded-xl px-3 py-2 text-cream"
                      >
                        <option value="1 Guest">1 Guest // Solo Ritual</option>
                        <option value="2 Guests">2 Guests // Cozy Duo</option>
                        <option value="4 Guests">4 Guests // Friends Unwind</option>
                        <option value="6 Guests">6 Guests // Family Circle</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information detail */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-light-caramel focus:outline-none rounded-xl px-3 py-2.5 text-cream"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="jane@gujicafe.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-light-caramel focus:outline-none rounded-xl px-3 py-2.5 text-cream"
                      required
                    />
                  </div>

                  {/* Submission triggers */}
                  <button 
                    type="submit" 
                    className="w-full bg-cream hover:bg-light-caramel text-espresso font-bold py-3.5 rounded-full transition-colors cursor-pointer text-xs uppercase tracking-wider mt-4"
                  >
                    Lock Selection &rarr;
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="booking-success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 py-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-caramel/25 border border-caramel/40 flex items-center justify-center mx-auto text-light-caramel">
                    <CheckCircle2 size={32} className="animate-bounce" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-cream">Booking Registered Securely!</h4>
                    <p className="text-xs text-beige/85 mt-2 leading-relaxed">
                      Thank you <span className="text-light-caramel font-semibold">{bookingName}</span>. We have reserved your space at <span className="text-light-caramel font-semibold">{bookingTableType}</span> for <span className="text-light-caramel font-semibold">{bookingGuests}</span> on <span className="text-light-caramel font-semibold">{bookingDate}</span> at <span className="text-light-caramel font-semibold">{bookingTime}</span>.
                    </p>
                    <span className="block text-[10px] font-mono text-muted uppercase mt-3 tracking-widest bg-white/5 py-1 px-3.5 rounded-md inline-block">
                      CODE ID #GC-{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted max-w-[280px] mx-auto leading-relaxed">
                    A confirmation voucher has been dispatched to {bookingEmail}.
                  </p>

                  <button 
                    onClick={resetBookingForm}
                    className="px-6 py-2 rounded-full border border-white/20 text-cream text-[10px] uppercase font-bold tracking-widest hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Book another slot
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          13. PREMIUM BOTTOM FOOTER
          ------------------------------------------------------------- */}
      <footer className="bg-espresso border-t border-white/12 py-16 px-6 sm:px-12 md:px-16 text-[#F7EFE5]/90">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          
          {/* Left panel description */}
          <div className="space-y-4">
            <h4 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 select-none">
              <span className="font-serif-instrument italic text-[#E2B77C] text-3xl">G</span>
              <span>Guji Cafe</span>
            </h4>
            <p className="text-xs sm:text-sm text-beige/80 max-w-sm leading-relaxed">
              Crafted coffee, cozy spaces, and memorable café moments. Visit any of our welcoming branches in San Fernando, Balaoan, or Tagudin.
            </p>
            <div className="flex items-center gap-4 text-muted">
              <a 
                href="https://www.facebook.com/profile.php?id=61561855393566" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-light-caramel transition-colors flex items-center gap-1"
                title="Facebook Page"
              >
                <Facebook size={18} />
                <span className="text-[11px] font-mono">Guji Cafe Page</span>
              </a>
            </div>
          </div>

          {/* Center navigation map links */}
          <div className="space-y-3 font-barlow text-sm">
            <span className="block text-xs uppercase tracking-widest text-[#E2B77C] font-semibold">NAVIGATION MAP</span>
            <div className="grid grid-cols-2 gap-2 text-muted text-xs sm:text-sm">
              <a href="#home" className="hover:text-cream transition-colors">Home</a>
              <a href="#menu" className="hover:text-cream transition-colors">Menu Highlights</a>
              <a href="#branches" className="hover:text-cream transition-colors">Branches Map</a>
              <a href="#story" className="hover:text-cream transition-colors">About Us</a>
              <a href="#visit" className="hover:text-cream transition-colors">Visit Guji</a>
            </div>
          </div>

          {/* Right contacts setup */}
          <div className="space-y-3 text-sm">
            <span className="block text-xs uppercase tracking-widest text-[#E2B77C] font-semibold">OUR BRANCHES</span>
            <div className="space-y-3 text-muted text-xs font-sans">
              <div>
                <a 
                  href="https://maps.app.goo.gl/BESeSptoV7ss82dKA" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cream transition-colors font-bold text-cream flex items-center gap-1"
                >
                  <span>San Fernando City, La Union</span>
                  <ArrowUpRight size={11} />
                </a>
                <p className="text-[10px] text-muted">📞 +63 969 492 6689</p>
              </div>
              <div>
                <a 
                  href="https://maps.app.goo.gl/MaFiY8symLv9uq1K9" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cream transition-colors font-bold text-cream flex items-center gap-1"
                >
                  <span>Balaoan, La Union</span>
                  <ArrowUpRight size={11} />
                </a>
                <p className="text-[10px] text-muted">📞 +63 991 974 6276</p>
              </div>
              <div>
                <a 
                  href="https://maps.app.goo.gl/4E4WrYjTiRMbr1vo6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cream transition-colors font-bold text-cream flex items-center gap-1"
                >
                  <span>Tagudin, Ilocos Sur</span>
                  <ArrowUpRight size={11} />
                </a>
                <p className="text-[10px] text-muted">📞 +63 951 094 0309</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted gap-4">
          <p>&copy; 2026 Guji Cafe. All rights reserved. Meticulously brewed.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cream transition-colors">Allergen Declarations</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
