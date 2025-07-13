import React, { useState, useEffect, useRef, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. 3D ARKA PLAN BİLEŞENİ
// GLSL (Shader) kodları
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vHeight;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Yavaş dalgalanma efekti
    float wave1 = sin(modelPosition.x * 2.0 + uTime * 0.5) * 0.1;
    float wave2 = sin(modelPosition.y * 3.0 + uTime * 0.3) * 0.1;
    
    // Mouse ile dalgalanma efekti
    float mouseDist = distance(modelPosition.xy, uMouse);
    float ripple = smoothstep(0.8, 0.0, mouseDist) * 0.3;
    
    modelPosition.z += wave1 + wave2 + ripple;
    vHeight = modelPosition.z;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
  }
`;

const fragmentShader = `
  varying float vHeight;

  void main() {
    // Yüksekliğe göre renk değişimi
    vec3 color1 = vec3(0.039, 0.443, 0.412); // #0A7169
    vec3 color2 = vec3(0.219, 0.698, 0.675); // #38B2AC
    vec3 finalColor = mix(color1, color2, vHeight * 2.0 + 0.5);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function WavingBackground() {
  const meshRef = useRef();
  const mousePos = useRef(new THREE.Vector2(10, 10)); // Başlangıçta ekran dışında

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: mousePos.current },
    }),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value += delta;
    }
  });

  const handlePointerMove = (event) => {
    // Mouse pozisyonunu -1 ile 1 aralığına normalize et
    mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Bu kod mouse pozisyonunu 3D sahne koordinatlarına dönüştürür.
    // Projeksiyonu basit tutmak için düzlemde basit bir dönüşüm yapalım.
    const planeMouseX = event.unprojectedPoint.x * 0.5;
    const planeMouseY = event.unprojectedPoint.y * 0.5;

    meshRef.current.material.uniforms.uMouse.value.x = planeMouseX;
    meshRef.current.material.uniforms.uMouse.value.y = planeMouseY;
  };

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={handlePointerMove}
      onPointerOut={() => mousePos.current.set(10, 10)}
    >
      <planeGeometry args={[20, 20, 100, 100]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
      />
    </mesh>
  );
}

// 2. ANA FOOTER BİLEŞENİ
const Logo = () => <span className="footer-logo">Saleweaver</span>;

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <footer className="footer-section-modern">
      {/* 3D Arka Plan */}
      <div className="footer-canvas">
        <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
          <WavingBackground />
        </Canvas>
      </div>

      {/* İçerik */}
      <div className="footer-content">
        <Container>
          <Row className="py-5">
            <Col
              lg={4}
              md={12}
              className="mb-5 mb-lg-0 text-center text-lg-start"
            >
              <Logo />
              <p className="footer-about-text my-4">
                Instagram ve Google Ads performansınızı birleştirerek pazarlama
                ROI'nizi maksimize eden hepsi bir arada çözüm.
              </p>
              <div className="social-icons">
                <a href="#twitter" className="social-icon-link">
                  <FaTwitter />
                </a>
                <a href="#instagram" className="social-icon-link">
                  <FaInstagram />
                </a>
                <a href="#linkedin" className="social-icon-link">
                  <FaLinkedinIn />
                </a>
              </div>
            </Col>

            <Col lg={2} md={4} sm={6} xs={6} className="mb-4 mb-lg-0">
              <h5 className="footer-heading">Platform</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#features" className="footer-link">
                    Özellikler
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="footer-link">
                    Nasıl Çalışır?
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="footer-link">
                    Fiyatlandırma
                  </a>
                </li>
              </ul>
            </Col>

            <Col lg={2} md={4} sm={6} xs={6} className="mb-4 mb-lg-0">
              <h5 className="footer-heading">Destek</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#faq" className="footer-link">
                    S.S.S.
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-link">
                    İletişim
                  </a>
                </li>
                <li>
                  <a href="#status" className="footer-link">
                    Sistem Durumu
                  </a>
                </li>
              </ul>
            </Col>

            <Col lg={4} md={4} sm={12} className="mb-4 mb-lg-0">
              <h5 className="footer-heading">Yasal</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#terms" className="footer-link">
                    Kullanım Koşulları
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="footer-link">
                    Gizlilik Politikası
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <div className="footer-bottom text-center py-4">
            © {new Date().getFullYear()} Saleweaver. Tüm hakları saklıdır.
          </div>
        </Container>
      </div>

      {/* Yukarı Çık Butonu */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="scroll-to-top-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 20px rgba(90, 103, 216, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style>{`
        .footer-section-modern {
          position: relative;
          color: #adb5bd;
          background-color: #0d1117; /* Canvas yüklenemezse fallback */
          overflow: hidden; /* Shader taşmalarını önler */
        }
        .footer-canvas {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 1;
        }
        .footer-content {
          position: relative;
          z-index: 2;
          background: linear-gradient(to top, rgba(13, 17, 23, 0.8), rgba(13, 17, 23, 0.6) 50%, transparent);
        }

        .footer-logo { font-size: 1.8rem; font-weight: bold; color: #ffffff; }
        .footer-about-text { font-size: 1rem; line-height: 1.7; color: #CBD5E0; }
        .footer-heading { color: #ffffff; font-weight: 600; margin-bottom: 1.5rem; }
        .footer-link {
          color: #A0AEC0; text-decoration: none; transition: color 0.2s ease-in-out;
          display: inline-block; margin-bottom: 0.75rem;
        }
        .footer-link:hover { color: #ffffff; }
        
        .social-icons { display: flex; gap: 1rem; justify-content: center; }
        @media (min-width: 992px) { .social-icons { justify-content: flex-start; } }
        .social-icons .social-icon-link {
          display: inline-flex; justify-content: center; align-items: center;
          width: 44px; height: 44px; border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .social-icons .social-icon-link:hover {
          background-image: linear-gradient(to right, #5A67D8, #38B2AC);
          transform: translateY(-3px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
        }

        .scroll-to-top-btn {
          position: fixed; bottom: 25px; right: 25px; z-index: 1000;
          background-image: linear-gradient(to right, #5A67D8, #38B2AC);
          color: white; border: none; border-radius: 50%;
          width: 50px; height: 50px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
