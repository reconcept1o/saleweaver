import React from 'react';
import { motion } from 'framer-motion';

// Bölümleri import ediyoruz
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import PricingSection from './PricingSection';
import Footer from './Footer';

// Tüm bölümler için ortak animasyon varyantları
const sectionVariants = {
  // Bölüm ekran dışındayken
  hidden: {
    opacity: 0,
    y: 50, // Aşağıdan yukarıya doğru hafifçe kayarak gelecek
  },
  // Bölüm ekrana girdiğinde
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function AnimatedSection({ children }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      // viewport={{ once: true }} özelliği, animasyonun sadece bir kere çalışmasını sağlar.
      // Kullanıcı yukarı-aşağı kaydırdığında tekrar tekrar tetiklenmez.
      viewport={{ once: true, amount: 0.2 }} // Bölümün %20'si görününce animasyon başlar
    >
      {children}
    </motion.section>
  );
}

function HomePage() {
  return (
    <>
      {/* HeroSection genellikle sayfa açıldığında zaten görünür olduğu için 
          ona bu animasyonu uygulamak gereksiz olabilir veya farklı bir giriş animasyonu olabilir.
          Biz şimdilik onu normal bırakıyoruz. */}
      <HeroSection />

      <AnimatedSection>
        <FeaturesSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <HowItWorksSection />
      </AnimatedSection>

      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>

      {/* Footer'a da aynı animasyonu uygulayabiliriz */}
      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </>
  );
}

export default HomePage;