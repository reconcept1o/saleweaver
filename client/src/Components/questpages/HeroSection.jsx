import React from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import * as THREE from "three";

// ==========================================================================
// 1. DİNAMİK ARKA PLAN (SORUNU ÇÖZECEK DEĞİŞİKLİKLERLE)
// ==========================================================================
const WaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#5A67D8"),
    uColor2: new THREE.Color("#38B2AC"),
    uMouse: new THREE.Vector2(0, 0),
  },
  ` varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); } `,
  ` uniform float uTime; uniform vec3 uColor1; uniform vec3 uColor2; uniform vec2 uMouse; varying vec2 vUv;
    float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
    float noise (in vec2 _st) { vec2 i = floor(_st); vec2 f = fract(_st); float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x; }
    void main() { 
        float time = uTime * 0.1; 
        vec2 mouseEffect = (uMouse - 0.5) * 0.3; 
        vec2 uv = vUv; // DEĞİŞTİ: UV koordinatları artık -1 ile 1 arasında değil, 0 ile 1 arasında kalıyor.
        
        // Desen hesaplamaları aynı kalabilir
        float linePattern = abs(sin(uv.x * 15.0 + time + uv.y * 5.0)) + abs(cos(uv.y * 15.0 + time)); 
        float circlePattern = distance(uv, mouseEffect + 0.5); 
        float n = noise(uv * 3.0 + time * 0.5); 
        float mixValue = smoothstep(0.2, 0.8, (linePattern + n - circlePattern * 0.5)); 
        vec3 finalColor = mix(uColor1, uColor2, mixValue); 
        
        // DEĞİŞTİ: Alpha (saydamlık) değeri 0.5'ten 1.0'a çıkarıldı. Artık OPAK.
        gl_FragColor = vec4(finalColor, 1.0); 
    }`
);
extend({ WaveMaterial });

const DynamicBackground = () => {
  const ref = useRef();
  const { mouse } = useThree();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.uTime += delta;
      ref.current.uMouse.x +=
        (mouse.x * 0.5 + 0.5 - ref.current.uMouse.x) * 0.05;
      ref.current.uMouse.y +=
        (mouse.y * 0.5 + 0.5 - ref.current.uMouse.y) * 0.05;
    }
  });
  return (
    // DEĞİŞTİ: Dörtgenin boyutu çok daha büyük ve pozisyonu kameranın arkasında.
    <mesh position={[0, 0, -25]}>
      <planeGeometry args={[200, 200, 32, 32]} />
      <waveMaterial ref={ref} />
    </mesh>
  );
};

// Parçacıklar (DEĞİŞİKLİK YOK)
const SimpleParticles = () => {
  const count = 200;
  const ref = useRef();
  const { viewport, mouse } = useThree();
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * viewport.width;
      temp[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return temp;
  }, [viewport.width, viewport.height]);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.x += (mouse.x * 5 - ref.current.position.x) * 0.02;
    ref.current.position.y += (mouse.y * 5 - ref.current.position.y) * 0.02;
    ref.current.rotation.y += delta * 0.1;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#E2E8F0"
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
};

// Ana Bölüm (DEĞİŞİKLİK YOK)
function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <section id="hero" className="hero-section-3d py-5">
        <div className="canvas-background">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <DynamicBackground />
            <SimpleParticles />
          </Canvas>
        </div>
        <Container className="h-100 d-flex flex-column justify-content-start pt-5">
          <Row className="justify-content-center text-center">
            <Col md={10} lg={9}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 variants={itemVariants} className="hero-title-3d">
                  Büyümenin Matematiği. <br /> Sizin Kontrolünüzde.
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="hero-subtitle-3d my-4"
                >
                  Duyguları değil, verileri yönetin.{" "}
                  <span className="highlight">Saleweaver</span>, işinizi
                  büyütmek için ihtiyacınız olan sayısal netliği ve stratejik
                  araçları tek bir platformda sunar.
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="d-grid gap-3 d-sm-flex justify-content-center"
                >
                  <Button
                    size="lg"
                    className="btn-glow-primary rounded-pill px-5 py-3 fw-bold"
                    href="/signup"
                  >
                    14 Gün Ücretsiz Deneyin
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="btn-outline-white-hover rounded-pill px-5 py-3 fw-bold"
                    href="#features"
                  >
                    Özellikleri Keşfet
                  </Button>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      <style>{`
          .hero-section-3d { position: relative; min-height: 100vh; height: 100vh; max-height: 1000px; width: 100%; color: #FFFFFF; overflow: hidden; display: flex; align-items: flex-start; justify-content: center; }
          .canvas-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background-color: #0A0A1A; }
          .hero-title-3d, .hero-subtitle-3d, .btn-glow-primary, .btn-outline-white-hover { position: relative; z-index: 1; }
          .hero-title-3d { font-size: clamp(2.2rem, 7vw, 4rem); font-weight: 800; line-height: 1.2; text-shadow: 0px 4px 20px rgba(0, 0, 0, 0.8); }
          .hero-subtitle-3d { font-size: clamp(1rem, 4vw, 1.2rem); color: #E2E8F0; max-width: 600px; margin-left: auto; margin-right: auto; text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.7); }
          .highlight { color: #38B2AC; font-weight: 700; }
          .btn-glow-primary { background-color: #5A67D8; border-color: #5A67D8; transition: all 0.3s ease; }
          .btn-glow-primary:hover { background-color: #4C51BF; border-color: #4C51BF; transform: translateY(-5px) scale(1.05); box-shadow: 0 15px 30px -10px rgba(90, 103, 216, 0.6); }
          .btn-outline-white-hover { color: #FFFFFF; border-color: rgba(255, 255, 255, 0.5); transition: all 0.3s ease; }
          .btn-outline-white-hover:hover { background-color: #FFFFFF; color: #0A0A1A; border-color: #FFFFFF; }
          @media (max-width: 768px) { .hero-section-3d { height: auto; min-height: 90vh; } }
      `}</style>
    </>
  );
}

export default HeroSection;
