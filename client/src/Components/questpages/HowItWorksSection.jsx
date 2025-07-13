import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, MeshDistortMaterial } from "@react-three/drei";
import { BsPlug, BsMagic, BsBarChartLine } from "react-icons/bs";
import * as THREE from "three";

// 1. VERİ: Metinler, Google Ads vizyonunu içerecek şekilde güncellendi
const stepsContent = [
  {
    icon: <BsPlug size={30} />,
    step: "Adım 1",
    title: "Tüm Kanallarınızı Bağlayın",
    text: "Güvenli bir şekilde Instagram, Facebook, Google Ads ve e-ticaret (Shopify, Ticimax vb.) hesaplarınızı saniyeler içinde Saleweaver'a entegre edin. Kurulum sihirbazımız size her adımda yol gösterecek.",
    objectPosition: [1, 0, -5],
    objectColor: "#5A67D8", // Mavi: Bağlantı ve Güven
  },
  {
    icon: <BsMagic size={30} />,
    step: "Adım 2",
    title: "Pazarlamanızı Bütünsel Yönetin",
    text: "İçeriklerinizi görsel takvimde planlarken, Google Ads kampanyalarınızı da aynı panelden yönetin. Saleweaver, tüm kanallarınız için satışları takip eden akıllı linkler oluşturur.",
    objectPosition: [-2, -10, -8],
    objectColor: "#F6E05E", // Sarı: Yaratıcılık ve Enerji
  },
  {
    icon: <BsBarChartLine size={30} />,
    step: "Adım 3",
    title: "Kanalları Karşılaştırın, Kârı Ölçümleyin",
    text: "Tüm kanallarınızın performansını tek bir raporda karşılaştırın. Hangi Instagram gönderisinin veya hangi Google reklamının size daha çok kazandırdığını görün ve pazarlama bütçenizi gerçek verilere göre optimize edin.",
    objectPosition: [2, -20, -12],
    objectColor: "#48BB78", // Yeşil: Büyüme ve Kârlılık
  },
];

// 2. 3D SAHNE
function Scene({ scrollProgress }) {
  const groupRef = useRef();

  useFrame(() => {
    const totalDistance = 20;
    const targetY = -scrollProgress * totalDistance;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.1
    );
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sparkles
        count={3000}
        scale={[30, 30, 25]}
        size={1}
        speed={0.5}
        color="#FFFFFF"
      />
      <group ref={groupRef}>
        {stepsContent.map((step, index) => (
          <Float
            key={index}
            speed={1.5}
            rotationIntensity={0.5}
            floatIntensity={1}
          >
            <mesh position={step.objectPosition}>
              <sphereGeometry args={[1.5, 32, 32]} />
              <MeshDistortMaterial
                color={step.objectColor}
                distort={0.4}
                speed={1.5}
                roughness={0.1}
                metalness={0.2}
              />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  );
}

// 3. ANA BİLEŞEN
function HowItWorksSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const wrapperRef = useRef(null);
  const totalSteps = stepsContent.length + 1;

  useEffect(() => {
    const handleScroll = () => {
      const el = wrapperRef.current;
      if (el) {
        const { top, height } = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = -top / (height - windowHeight);
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = Math.floor(scrollProgress * (totalSteps - 0.001));

  return (
    <section ref={wrapperRef} id="howitworks" className="how-it-works-wrapper">
      <div className="sticky-canvas">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>
      <div className="scroll-content">
        <div
          className="content-block"
          style={{
            opacity: activeIndex === 0 ? 1 : 0.2,
            transform: `scale(${activeIndex === 0 ? 1 : 0.95})`,
          }}
        >
          <h2 className="section-title-dark">
            Karmaşadan Netliğe 3 Basit Adımda
          </h2>
          <p className="section-subtitle-dark mt-3">
            Saleweaver'ı kullanmaya başlamak ve tüm pazarlama kanallarınızın
            sonuçlarını görmeye başlamak işte bu kadar kolay.
          </p>
        </div>
        {stepsContent.map((step, index) => (
          <div key={index} className="content-block">
            <div
              className="text-card"
              style={{
                opacity: activeIndex === index + 1 ? 1 : 0.2,
                transform: `scale(${activeIndex === index + 1 ? 1 : 0.95})`,
              }}
            >
              <div className="step-icon-overlay">{step.icon}</div>
              <div className="step-number-overlay">{step.step}</div>
              <h3 className="step-title-overlay">{step.title}</h3>
              <p className="step-text-overlay">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        /* ANA SARMALAYICI */
        .how-it-works-wrapper {
          position: relative;
          width: 100%;
          height: 400vh; /* 3 adım + 1 giriş = 4 bölüm */
          background-color: #0A7169; /* Koyu, derin bir uzay mavisi */
        }

        /* YAPIŞKAN CANVAS */
        .sticky-canvas {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        /* KAYAN İÇERİK */
        .scroll-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
        }
        
        .content-block {
          width: 90%;
          max-width: 620px; 
          padding: 1rem;
          text-align: center;
          color: #E2E8F0;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .text-card {
          padding: 2.5rem;
          background: rgba(10, 15, 26, 0.5); 
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          width: 100%;
          transition: inherit;
        }
        
        /* Metin Stilleri */
        .section-title-dark {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #FFFFFF;
        }
        
        .section-subtitle-dark {
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          color: #A0AEC0; /* Biraz daha yumuşak beyaz */
        }
        
        .step-icon-overlay {
          color: #FFFFFF;
          margin-bottom: 1.5rem;
          display: inline-block;
        }
        
        .step-number-overlay {
          color: #90CDF4; /* Açık mavi */
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }
        
        .step-title-overlay {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: #FFFFFF;
        }
        
        .step-text-overlay {
          font-size: clamp(1.05rem, 2vw, 1.15rem);
          line-height: 1.75;
          color: #E2E8F0;
        }
      `}</style>
    </section>
  );
}

export default HowItWorksSection;
