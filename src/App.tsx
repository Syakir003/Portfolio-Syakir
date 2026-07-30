import React, { useState, useEffect } from 'react';
import { Linkedin,Github } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, easeInOut } from 'framer-motion';
import { 
  Menu,
  X,
  ArrowRight,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

import { Project, Experience, Education, Certificate } from './types';
import CustomCursor from './components/CustomCursor';
import Magnetic from './components/Magnetic';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'Biografi' },
    { id: 'projects', label: 'Proyek' },
    { id: 'experience', label: 'Pengalaman' },
    { id: 'education', label: 'Pendidikan' },
    { id: 'certificates', label: 'Sertifikat' },
  ];

  const skills = [
  'Web Development',
  'Frontend Development',
  'React & TypeScript',
  'UI/UX Design',
  'Database (MySQL)',
  'Jaringan Komputer',
  'Git & GitHub',
  'Problem Solving',
  'Kepemimpinan Tim',
  'Public Speaking',
  'Manajemen Waktu'
  ];

  const projects: Project[] = [
    {
      title: "Katalog Rental Mobil Naivara Group",
      date: "Oktober 2025",
      image: "/images/Naivara.png",
      description: "Aplikasi berbasis web untuk mengelola katalog penyewaan mobil, memudahkan pelanggan dalam melihat ketersediaan unit dan melakukan pemesanan secara online."
    },
    {
      title: "Profile Company HDBAirconds.id",
      date: "September 2025",
      image: "/images/Hdb.png",
      description: "Website company profile profesional yang merangkum layanan pendingin ruangan, portofolio proyek, dan mempermudah calon klien untuk menghubungi perusahaan."
    }
  ];

  const experiences: Experience[] = [
    {
      title: "Tim Penulisan Internal PKM-KC (Karsa Cipta)",
      organization: "Judul : SMART BIOMETRIC ATTENDANCE BERBASIS FACE ID TERINTEGRASI IoT SEBAGAI PRESENSI ANTI KECURANGAN MAHASISWA",
      date: "2024",
      description: "Terlibat aktif dalam penyusunan proposal Program Kreativitas Mahasiswa bidang Karsa Cipta. Berkolaborasi dengan tim untuk merancang solusi inovatif berbasis teknologi yang dapat memberikan dampak positif bagi masyarakat.",
      images: [
        "https://cms-resources.prd.timeshighereducation.com/sites/default/files/styles/featured_image/2023-08/Four%20strategies%20that%20rethink%20whole%20group%20discussions.jpg?itok=9ErMTi8O",
        "https://ftk.unisnu.ac.id/assets/media/pkmos5.jpg",
        "https://wpvip.edutopia.org/wp-content/uploads/2024/07/iStock-1442227275-CROP.jpg?w=2880&quality=85"
      ]
    },
    {
      title: "Pekan Prestasi Mahasiswa",
      organization: "UKM Seni - Sie Humas",
      date: "2025",
      description: "Berperan dalam kepanitiaan Pekan Prestasi Mahasiswa sebagai bagian dari Sie Humas, dengan tanggung jawab mengelola komunikasi dan penyebaran informasi kegiatan. Juga dipercaya sebagai Master of Ceremony (MC), memandu jalannya acara dengan baik, menjaga alur tetap terstruktur, serta menciptakan suasana yang interaktif dan profesional.",
      images: [
        "/images/PPM.jpeg",
        "/images/PPM2.jpeg",
        "/images/PPM3.jpeg"
      ]
    },
    {
    title: "Ketua Divisi Musik",
    organization: "UKM Seni Polinema",
    date: "2025 - Sekarang",
    description: "Memimpin Divisi Musik UKM Seni Polinema dengan mengoordinasikan anggota, merancang konsep penampilan, serta memastikan kualitas musikal dalam setiap kegiatan dan event kampus tetap optimal.",
    images: [
      "/images/Kadiv1.jpeg",
      "/images/Kadiv2.jpeg",
      "/images/Kadiv1.jpeg"
    ]
  }
  ];

  const educations: Education[] = [
    {
      school: "Politeknik Negeri Malang",
      major: "D3 Manajemen Informatika",
      date: "2024 - Sekarang",
      description: "Fokus pada pengembangan perangkat lunak, administrasi jaringan, dan manajemen basis data. Aktif dalam berbagai proyek praktikum yang mengasah kemampuan problem-solving.",
      image: "/images/Polinema3.webp"
    },
    {
      school: "SMAN 1 Pacet",
      major: "Ilmu Pengetahuan Sosial",
      date: "2021 - 2024",
      description: "Selama menempuh pendidikan di jurusan Ilmu Pengetahuan Sosial (IPS), aktif dalam organisasi dan ekstrakurikuler fotografi sebagai Wakil Ketua. Bertanggung jawab dalam koordinasi tim, pelaksanaan kegiatan, serta pengembangan kreativitas dan kolaborasi antar anggota.",
      image: "/images/SMAN1Pacet.jpg"
    }
  ];

  const certificates: Certificate[] = [
    {
      title: "GoWorld Asia – Futurepreneur Selection Program",
      issuer: "FES GO WORLD",
      date: "15 Juni 2025",
      description: "Terpilih sebagai peserta dalam program seleksi wirausaha muda masa depan, mempelajari dasar-dasar membangun bisnis yang berkelanjutan.",
      image: "/images/fesgo2.jpeg"
    },
    {
      title: "Cisco Academy – Networking Operating System Basic",
      issuer: "Cisco",
      date: "18 Juni 2025",
      description: "Menyelesaikan pelatihan dasar sistem operasi jaringan, mencakup konfigurasi router, switch, dan pemahaman topologi jaringan.",
      image: "/images/Cisco.jpeg"
    },
    {
      title: "Grow Mindset for Futurepreneur – Public Speaking",
      issuer: "Grow Insight",
      date: "15 Juni 2025",
      description: "Mengikuti pelatihan intensif public speaking untuk meningkatkan kepercayaan diri dan kemampuan komunikasi efektif di depan umum.",
      image: "/images/fesgo1.jpeg"
    }
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: easeInOut } }
  };

  const textReveal = {
    hidden: { y: "120%", opacity: 0, rotateZ: 3 },
    visible: { y: 0, opacity: 1, rotateZ: 0, transition: { duration: 1.2, ease: easeInOut } }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans">
      <div className="noise-bg" />
      <CustomCursor />
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-[#1A1A1A] origin-left z-100" style={{ scaleX }} />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#F5F2ED]/60 backdrop-blur-md py-4 border-b border-[#1A1A1A]/10' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display font-bold text-2xl tracking-tighter hover:opacity-70 transition-opacity hover-trigger uppercase"
          >
            Portfolio Syakir
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <Magnetic>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="text-[15px] uppercase tracking-[0.25em] font-medium text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors hover-trigger p-2"
                  >
                    {item.label}
                  </button>
                </Magnetic>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-[#1A1A1A] hover-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#F5F2ED] flex flex-col items-center justify-center gap-10"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="font-display font-bold text-4xl uppercase tracking-widest text-[#1A1A1A] hover:text-[#1A1A1A]/50 transition-colors hover-trigger"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative z-0 min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
          
          {/* Background Photo */}
          <div className="absolute inset-0 -z-20">
            <img 
              src="https://picsum.photos/seed/cyberpunk/1920/1080" 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-100 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-b from-[#F5F2ED]/10 via-[#F5F2ED]/10 to-[#F5F2ED]/80" />
          </div>
          
          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#1A1A1A]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
              className="w-full relative"
            > 
              <h1 className="flex flex-col text-[15vw] md:text-[11vw] leading-[0.85] tracking-tighter uppercase font-display font-bold">
                <div className="overflow-hidden pb-2 md:pb-4"><motion.span variants={textReveal} className="block text-outline origin-bottom-left" style={{ fontFamily: 'Poppins, sans-serif' }}>AKHMAD</motion.span></div>
                <div className="overflow-hidden pb-2 md:pb-4"><motion.span variants={textReveal} className="block ml-[10vw] md:ml-[15vw] origin-bottom-left" style={{ fontFamily: 'Poppins, sans-serif' }}>ABDULLAH</motion.span></div>
                <div className="overflow-hidden pb-2 md:pb-4"><motion.span variants={textReveal} className="block font-display font-bold text-[15vw] md:text-[11vw] leading-[0.85] text-[#1A1A1A] ml-[5vw] md:ml-[8vw] origin-bottom-left drop-shadow-[0_5px_20px_rgba(0,0,0,0.15)]" style={{ fontFamily: 'Poppins, sans-serif' }}>SYAKIR</motion.span></div>
              </h1>
              
              <motion.div variants={fadeUp} className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <p className="text-lg md:text-xl text-[#1A1A1A]/60 font-light max-w-md leading-relaxed">
                  Crafting elegant, functional, and minimal digital experiences with a focus on web and software development.
                </p>
                <div className="flex gap-6">
                  <button onClick={() => scrollTo('projects')} className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium border-b border-[#1A1A1A]/30 pb-1 hover:border-[#1A1A1A] transition-colors hover-trigger">Lihat Proyek</button>
                  <button onClick={() => scrollTo('contact')} className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium border-b border-[#1A1A1A]/30 pb-1 hover:border-[#1A1A1A] transition-colors hover-trigger">Hubungi Saya</button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Marquee Banner */}
        <div className="w-full overflow-hidden py-8 border-y border-[#1A1A1A]/10 bg-[#EAE6DF] transform -rotate-1 my-20">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-3xl md:text-5xl font-display font-bold uppercase tracking-widest mx-8 text-[#1A1A1A]/70">
                Creative Developer <span className="text-[#1A1A1A]/20 mx-4 font-sans font-normal">•</span> UI/UX Enthusiast <span className="text-[#1A1A1A]/20 mx-4 font-sans font-normal">•</span> Problem Solver <span className="text-[#1A1A1A]/20 mx-4 font-sans font-normal">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h2 className="font-mono text-[45px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/80">
                  Biography
                </h2>
              </div>
              <div className="md:col-span-8">
                <motion.p 
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                  className="font-display font-medium text-3xl md:text-4xl lg:text-3xl leading-snug text-[#1A1A1A] mb-16 tracking-tight"
                >Mahasiswa Manajemen Informatika di Politeknik Negeri Malang yang berfokus pada pengembangan web dan software. Memiliki ketertarikan dalam menciptakan produk digital yang tidak hanya fungsional, tetapi juga memiliki nilai estetika.
                  Selain aktif dalam pengembangan teknologi, juga berperan sebagai Ketua Divisi Musik UKM Seni Polinema, menggabungkan kreativitas dan kepemimpinan dalam setiap proyek yang dijalankan. 
                  Terbiasa bekerja dalam tim, adaptif terhadap tantangan, dan terus mengembangkan kemampuan di bidang teknologi.
                  Memiliki ketertarikan mendalam pada <span className="text-[#1A1A1A]/50">Web Development</span> dan <span className="text-[#1A1A1A]/50">Software Engineering</span>.
                </motion.p>

                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                >
                  <h3 className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/50 mb-6">Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-8 py-4 border border-[#1A1A1A]/10 rounded-full text-base md:text-lg font-medium tracking-wide text-[#1A1A1A]/80 hover:bg-[#1A1A1A] hover:text-[#F5F2ED] transition-all duration-300 hover-trigger"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="hairline mb-16" />
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter uppercase">Proyek Saya</h2>
              <p className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/50">2024 — 2026</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="group cursor-pointer hover-trigger"
                >
                  <div className="overflow-hidden mb-8 bg-[#EAE6DF] rounded-sm">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full aspect-4/3 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-display font-bold text-3xl md:text-4xl group-hover:tracking-widest transition-all duration-500 uppercase">
                        {project.title}
                      </h3>
                      <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#1A1A1A]" strokeWidth={1.5} size={28} />
                    </div>
                    <p className="text-[#1A1A1A]/60 font-light leading-relaxed max-w-md">
                      {project.description}
                    </p>
                    <span className="font-mono text-[15px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40 mt-2">
                      {project.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience & Education Section */}
        <section className="py-32 px-6 md:px-12 bg-[#EBE8E3]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-24">
              
              {/* Experience */}
              <div id="experience">
                <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter uppercase">Pengalaman</h2>
                <div className="flex flex-col gap-16">
                  {experiences.map((exp, index) => (
                    <motion.div 
                      key={exp.title}
                      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
                      variants={fadeUp}
                      className="group hover-trigger"
                    >
                      <div className="hairline mb-8 group-hover:bg-[#1A1A1A]/20 transition-colors" />
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                        <h3 className="font-display font-bold text-3xl group-hover:tracking-widest transition-all duration-500 uppercase">{exp.title}</h3>
                        <span className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40 whitespace-nowrap">
                          {exp.date}
                        </span>
                      </div>
                      <p className="text-[#1A1A1A]/80 font-medium mb-2">{exp.organization}</p>
                      {exp.description && (
                        <p className="text-[#1A1A1A]/60 font-light mb-8 leading-relaxed text-sm">{exp.description}</p>
                      )}
                      
                      <div className="grid grid-cols-3 gap-4">
                        {exp.images.map((img, i) => (
                          <div key={i} className="aspect-square overflow-hidden bg-[#EAE6DF]">
                            <img 
                              src={img} 
                              alt={`Experience ${i}`} 
                              className="w-full h-full object-cover opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-700 ease-out"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div id="education">
                <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter uppercase">Pendidikan</h2>
                <div className="flex flex-col gap-16">
                  {educations.map((edu, index) => (
                    <motion.div 
                      key={edu.school}
                      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
                      variants={fadeUp}
                      className="group hover-trigger"
                    >
                      <div className="hairline mb-8 group-hover:bg-[#1A1A1A]/20 transition-colors" />
                      <div className="overflow-hidden mb-8 bg-[#EAE6DF]">
                        <img 
                          src={edu.image} 
                          alt={edu.school} 
                          className="w-full aspect-21/9 object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                        <h3 className="font-display font-bold text-3xl group-hover:tracking-widest transition-all duration-500 uppercase">{edu.school}</h3>
                        <span className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40 whitespace-nowrap">
                          {edu.date}
                        </span>
                      </div>
                      <p className="text-[#1A1A1A]/80 font-medium mt-4 mb-2">{edu.major}</p>
                      {edu.description && (
                        <p className="text-[#1A1A1A]/60 font-light leading-relaxed text-sm">{edu.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="hairline mb-16" />
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter uppercase">Sertifikasi</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
                  variants={fadeUp}
                  className="group hover-trigger"
                >
                  <div className="overflow-hidden mb-8 bg-[#EAE6DF] p-8 border border-[#1A1A1A]/5">
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className="w-full aspect-4/3 object-contain opacity-100 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-4 leading-snug group-hover:tracking-widest transition-all duration-500 uppercase">
                    {cert.title}
                  </h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <p className="text-[#1A1A1A]/80 font-medium text-sm">{cert.issuer}</p>
                    <p className="font-mono text-[20px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40">{cert.date}</p>
                  </div>
                  {cert.description && (
                    <p className="text-[#1A1A1A]/60 font-light leading-relaxed text-sm">{cert.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 md:px-12 bg-[#EBE8E3]">
          <div className="max-w-7xl mx-auto">
            <div className="hairline mb-24" />
            
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
              className="flex flex-col md:flex-row justify-between items-start gap-16"
            >
              <div className="max-w-2xl">
                <h2 className="font-display font-bold text-6xl md:text-8xl mb-8 leading-none tracking-tighter uppercase">Mari Kita Membangun<br/><span className="text-[#1A1A1A]/50">bersama.</span></h2>
                <p className="text-xl text-[#1A1A1A]/60 font-light">Membangun pengalaman digital yang bermakna. Mari berkolaborasi.</p>
              </div>

              <div className="flex flex-col gap-8 min-w-200px">
                <Magnetic>
                  <a href="mailto:akhmadabdullahsyakirmi1a@gmail.com" className="group flex items-center gap-6 hover-trigger w-fit">
                    <div className="w-12 h-12 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#F5F2ED] transition-all duration-300">
                      <Mail size={18} strokeWidth={1.5} />
                    </div>
                    <span className="font-light text-lg group-hover:translate-x-2 transition-transform duration-300">Email Me</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="https://wa.me/6282333318107" className="group flex items-center gap-6 hover-trigger w-fit">
                    <div className="w-12 h-12 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#F5F2ED] transition-all duration-300">
                      <Phone size={18} strokeWidth={1.5} />
                    </div>
                    <span className="font-light text-lg group-hover:translate-x-2 transition-transform duration-300">+62 823-3331-8107</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <div className="group flex items-center gap-6 hover-trigger w-fit">
                    <div className="w-12 h-12 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#F5F2ED] transition-all duration-300">
                      <MapPin size={18} strokeWidth={1.5} />
                    </div>
                    <span className="font-light text-lg group-hover:translate-x-2 transition-transform duration-300">Mojokerto, Jawa Timur</span>
                  </div>
                </Magnetic>
                <Magnetic>
                  <a href="https://www.linkedin.com/in/akhmad-abdullah-syakir-bb49282b7/" className="group flex items-center gap-6 hover-trigger w-fit">
                    <div className="w-12 h-12 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#F5F2ED] transition-all duration-300">
                      <Linkedin size={18} strokeWidth={1.5} />
                    </div>
                    <span className="font-light text-lg group-hover:translate-x-2 transition-transform duration-300">LinkedIn</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="https://github.com/Syakir003" className="group flex items-center gap-6 hover-trigger w-fit">
                     <div className="w-12 h-12 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#F5F2ED] transition-all duration-300">
                       <Github size={18} strokeWidth={1.5} />
                     </div>
                     <span className="font-light text-lg group-hover:translate-x-2 transition-transform duration-300">Github</span>
                   </a>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-[#1A1A1A]/10 bg-[#F5F2ED]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40">
          <p>© 2026 Akhmad Abdullah Syakir.</p>
          <p>Designed by <span className="font-display font-bold text-sm text-[#1A1A1A]/60">Syakir</span>.</p>
        </div>
      </footer>
    </div>
  );
}
