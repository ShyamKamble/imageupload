import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Github, ExternalLink, Code, Database, Brain, Smartphone, Globe, Zap, Palette, Film, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// A new component for the card to encapsulate the parallax logic
const ProjectCard = ({ project, position }) => {
  const cardRef = useRef(null);

  // Parallax effect for desktop only
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 1024) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 20; // Reduced intensity
      const y = (e.clientY - top - height / 2) / 20;
      card.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = `perspective(1200px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };

    const parentGroup = card.closest('.group');
    parentGroup.addEventListener('mousemove', handleMouseMove);
    parentGroup.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parentGroup.removeEventListener('mousemove', handleMouseMove);
      parentGroup.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in-out transform-gpu group",
        position === 'center'
          ? 'lg:scale-100 lg:z-10'
          // FIX: Increased opacity for better visibility
          : 'lg:scale-90 lg:opacity-90',
        'lg:hover:!opacity-100 lg:hover:!scale-100 lg:hover:z-20'
      )}
    >
      <div ref={cardRef} className={cn("project-card rounded-2xl overflow-hidden relative", project.highlight && "highlighted-card")} style={{ transformStyle: "preserve-3d" }}>
        {project.highlight && (
          <div className="highlight-badge">
            <Star className="w-3 h-3 mr-1.5" />
            Featured
          </div>
        )}
        <div className="relative h-52">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="p-6 bg-white">
          <h3 className="anim-underline text-xl font-bold text-gray-800 mb-3">
            {project.title}
          </h3>
          <p className="text-gray-600 mb-5 leading-relaxed text-sm">
            {project.description}
          </p>
          <div className="mb-5">
            <h4 className="anim-underline text-sm font-semibold text-gray-700 mb-3 inline-block">Key Features</h4>
            <ul className="space-y-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-orange-500 mr-2.5 mt-1 flex-shrink-0">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h4 className="anim-underline text-sm font-semibold text-gray-700 mb-3 inline-block">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 pt-2">
            <button className="button-primary flex-1 group/btn">
              <Github className="w-4 h-4" />
              <span>Code</span>
            </button>
            <button className="button-secondary flex-1 group/btn">
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('none');
  const projectsContainerRef = useRef(null);

  // DYNAMIC CONTENT: Added more features and technologies to test layout
  const projects = [
    {
      title: "News Website",
      description: "A comprehensive news platform featuring modern design and dynamic content. Integrated third-party APIs for real-time news updates and article searching.",
      technologies: ["Express.js", "React.js", "Node.js", "Shadcn APIs", "Tailwind", "Axios"],
      features: [
        "Integrated third-party APIs for dynamic news content",
        "Utilized Axios for efficient API calls with fast data retrieval",
        "Leveraged React & Tailwind for a fully responsive interface",
      ],
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=220&fit=crop&auto=format",
      icon: <Code className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Salary Prediction App",
      description: "A machine learning-powered web application for salary prediction using various algorithms, featuring interactive data visualizations.",
      technologies: ["Machine Learning", "Streamlit", "SVM", "Random Forest"],
      features: [
        "Developed ML model to predict salaries based on Stack Overflow data",
        "Utilized Streamlit library for a user-friendly web interface",
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop&auto=format",
      icon: <Brain className="w-6 h-6" />,
      color: "from-green-500 to-teal-600"
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with a modern shopping cart, payment integration, and inventory management.",
      technologies: ["React.js", "Node.js", "MongoDB", "Stripe API"],
      features: [
        "Implemented secure payment processing with Stripe integration",
        "Built responsive product catalog with advanced filtering and search",
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=220&fit=crop&auto=format",
      icon: <Database className="w-6 h-6" />,
      color: "from-orange-500 to-red-600",
      highlight: true // HIGHLIGHT TAG
    },
    {
      title: "Design Tool Clone",
      description: "A collaborative real-time design application inspired by Figma, featuring a live cursor, comments, and reactions.",
      technologies: ["Next.js 14", "Liveblocks", "Fabric.js", "Shadcn UI"],
      features: [
          "Real-time collaboration with live cursors and presence",
          "Interactive canvas with shape creation and manipulation",
      ],
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=220&fit=crop&auto=format",
      icon: <Palette className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500"
    },
    {
        title: "Animated Movie App",
        description: "A visually engaging application for discovering and tracking animated movies, built with server-side rendering and infinite scroll.",
        technologies: ["Next.js", "Framer Motion", "Server Actions"],
        features: [
            "Infinite scroll for seamless browsing of movie content",
            "Stunning animations and transitions using Framer Motion",
        ],
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=220&fit=crop&auto=format",
        icon: <Film className="w-6 h-6" />,
        color: "from-indigo-500 to-fuchsia-500"
    }
  ];

  // SLIDING CAROUSEL LOGIC
  const handleNavigation = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      }
      setSlideDirection('none');
      setIsAnimating(false);
    }, 500); // Match transition duration
  };

  const getVisibleIndices = () => {
    const total = projects.length;
    if (window.innerWidth < 1024) {
      return [currentIndex];
    }
    return [
      (currentIndex - 1 + total) % total,
      currentIndex,
      (currentIndex + 1) % total
    ];
  };
  
  const [visibleIndices, setVisibleIndices] = useState(getVisibleIndices());

  useEffect(() => {
    if (slideDirection === 'none') {
      setVisibleIndices(getVisibleIndices());
    }
  }, [currentIndex, slideDirection]);
  
  useEffect(() => {
    const handleResize = () => setVisibleIndices(getVisibleIndices());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-20 sm:py-24 md:py-28 bg-gray-50/70 overflow-hidden" id="projects">
      <div className="section-container">
        <div className="text-center mb-14 sm:mb-20">
          <span className="pulse-chip mx-auto mb-4">Showcase</span>
          <h2 className="section-title mb-4">Featured Projects</h2>
          <p className="section-subtitle mx-auto">A selection of my work, demonstrating technical skills and creative problem-solving.</p>
        </div>

        <div className="relative">
          <div className="relative flex items-center justify-center lg:px-20">
            <button
              onClick={() => handleNavigation('prev')}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 nav-button group disabled:opacity-50 disabled:cursor-not-allowed hidden lg:flex"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={() => handleNavigation('next')}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 nav-button group disabled:opacity-50 disabled:cursor-not-allowed hidden lg:flex"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            <div ref={projectsContainerRef} className="w-full lg:w-[calc(100%-10rem)] overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: slideDirection === 'next' ? 'translateX(-100%)' : slideDirection === 'prev' ? 'translateX(100%)' : 'translateX(0)',
                }}
              >
                {visibleIndices.map((index, i) => (
                  <div key={index} className="w-full lg:w-1/3 flex-shrink-0 px-4 lg:px-6">
                    <ProjectCard
                      project={projects[index]}
                      position={i === 1 || window.innerWidth < 1024 ? 'center' : 'side'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
            
          <div className="flex items-center justify-center mt-12 space-x-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating && index !== currentIndex) {
                    handleNavigation(index > currentIndex ? 'next' : 'prev');
                  }
                }}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  index === currentIndex 
                    ? "bg-orange-500 w-8 h-3" 
                    : "bg-gray-300 w-3 h-3 hover:bg-gray-400"
                )}
              />
            ))}
          </div>

          <div className="lg:hidden flex justify-center items-center gap-4 mt-8">
            <button onClick={() => handleNavigation('prev')} disabled={isAnimating} className="w-12 h-12 nav-button group"><ChevronLeft className="w-6 h-6" /></button>
            <p className="text-sm text-gray-600 tabular-nums">{currentIndex + 1} / {projects.length}</p>
            <button onClick={() => handleNavigation('next')} disabled={isAnimating} className="w-12 h-12 nav-button group"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-container { max-width: 1536px; margin: 0 auto; padding: 0 1rem; }
        .pulse-chip { display: inline-flex; align-items: center; padding: 0.5rem 1.25rem; background-color: #fff7ed; color: #c2410c; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; border: 1px solid #fed7aa; }
        .section-title { font-size: 2.5rem; font-weight: 800; color: #1f2937; line-height: 1.2; }
        .section-subtitle { font-size: 1.125rem; color: #4b5563; max-width: 42rem; }

        .project-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03);
        }
        .group:hover .project-card {
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
        }
        
        /* HIGHLIGHT STYLES */
        .highlighted-card {
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #fb923c;
        }
        .highlight-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          background-image: linear-gradient(to right, #fb923c, #f97316);
          color: white;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* ANIMATING UNDERLINE */
        .anim-underline {
          position: relative;
          display: inline-block;
        }
        .anim-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #f97316;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease-in-out;
        }
        .group:hover .anim-underline::after {
          transform: scaleX(1);
        }

        .nav-button { background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4b5563; box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.07); border: 1px solid #e5e7eb; transition: all 0.2s ease; }
        .nav-button:hover { border-color: #fb923c; color: #f97316; box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1); }
        .tech-tag { padding: 0.3rem 0.8rem; background-color: #fff7ed; color: #c2410c; font-size: 0.75rem; font-weight: 500; border-radius: 9999px; border: 1px solid #fed7aa; }
        .button-primary { display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.6rem 1rem; background-color: #1f2937; color: white; border-radius: 0.5rem; font-weight: 500; transition: all 0.2s; }
        .button-primary:hover { background-color: #374151; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .button-secondary { display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.6rem 1rem; background-color: #ffffff; color: #374151; border-radius: 0.5rem; font-weight: 500; border: 1px solid #d1d5db; transition: all 0.2s; }
        .button-secondary:hover { background-color: #f9fafb; border-color: #9ca3af; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        @media (min-width: 1024px) {
          .section-title { font-size: 3.25rem; }
        }
      `}</style>
    </section>
  );
};

export default Projects;