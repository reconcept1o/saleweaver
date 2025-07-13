import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, useInView, animate } from "framer-motion";
import {
  BsInbox,
  BsLink45Deg,
  BsBinoculars,
  BsGoogle,
  BsInstagram,
  BsMagic,
  BsArrowDown,
} from "react-icons/bs";

// --- YARDIMCI BİLEŞENLER ---

// 1. Animasyonlu Sayı Sayacı
function AnimatedNumber({
  toValue,
  formatter = (v) => v.toLocaleString("tr-TR"),
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, toValue, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          ref.current.textContent = formatter(Math.round(value));
        },
      });
    }
  }, [isInView, toValue, formatter]);
  return <span ref={ref}>0</span>;
}

// 2. Animasyonlu Bölüm Sarmalayıcı
const AnimatedSection = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
  >
    {children}
  </motion.div>
);

// 3. Özellik Kartı Bileşeni
const FeatureCard = ({ icon, title, text }) => (
  <motion.div
    className="feature-card-light h-100"
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
  >
    <div className="feature-icon-light">{icon}</div>
    <h3 className="feature-card-title-light">{title}</h3>
    <p className="feature-card-text-light">{text}</p>
  </motion.div>
);

// --- ANA BİLEŞEN ---
function FeaturesSection() {
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  return (
    <>
      <section id="features" className="features-section-light">
        <Container>
          {/* Bölüm 1: Giriş */}
          <AnimatedSection className="text-center mb-5 pb-5">
            <h2 className="section-title-light">
              Dijital Pazarlama Karmaşasına Son.
            </h2>
            <p className="section-subtitle-light mt-3">
              Saleweaver, sosyal medya eforlarınızı ve Google reklam
              harcamalarınızı, e-ticaret sonuçlarınızla tek bir güçlü merkezde
              birleştirir. <br /> Hangi kanalın size ne kazandırdığını net bir
              şekilde görün.
            </p>
          </AnimatedSection>

          {/* Bölüm 2: Problem ve Çözümün Görsel Anlatımı */}
          <AnimatedSection>
            <Row className="justify-content-center text-center">
              <Col xs={12}>
                <h3 className="problem-title">
                  Dağınık Kanallar, Belirsiz Sonuçlar...
                </h3>
              </Col>
            </Row>
            {/* Kanallar */}
            <Row className="justify-content-center align-items-center text-center mt-4">
              <Col md={5}>
                <div className="flow-node">
                  <BsInstagram size={24} /> Instagram Eforları
                </div>
              </Col>
              <Col md={2} className="d-none d-md-block">
                <span className="flow-plus">+</span>
              </Col>
              <Col md={5}>
                <div className="flow-node">
                  <BsGoogle size={24} /> Google Ads Harcamaları
                </div>
              </Col>
            </Row>
            {/* Oklar */}
            <Row className="justify-content-center text-center">
              <Col xs={12} className="flow-arrow-container">
                <BsArrowDown size={30} />
              </Col>
            </Row>
            {/* Saleweaver Kutusu */}
            <Row className="justify-content-center text-center">
              <Col md={6}>
                <div className="flow-brand-box">Saleweaver Zekası</div>
              </Col>
            </Row>
            {/* Oklar */}
            <Row className="justify-content-center text-center">
              <Col xs={12} className="flow-arrow-container">
                <BsArrowDown size={30} />
              </Col>
            </Row>
            {/* Sonuç Kartı */}
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <div className="report-card-static">
                  <div className="report-header">
                    <p>SONUÇ</p>
                    <h4>Birleşik Performans Raporu</h4>
                  </div>
                  <div className="report-body">
                    <div className="channel-performance-static">
                      <div className="channel-title">
                        <BsInstagram /> Reels
                      </div>
                      <div className="channel-roi success">ROI: %450</div>
                    </div>
                    <div className="channel-performance-static">
                      <div className="channel-title">
                        <BsGoogle /> Arama Ağı
                      </div>
                      <div className="channel-roi warning">ROI: %180</div>
                    </div>
                  </div>
                  <div className="report-footer">
                    <span className="metric-label">TOPLAM CİRO</span>
                    <div className="metric-value accent">
                      <AnimatedNumber
                        toValue={28650}
                        formatter={(v) => `₺ ${v.toLocaleString("tr-TR")}`}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </AnimatedSection>

          {/* Bölüm 3: Diğer Araçlar */}
          <AnimatedSection className="text-center mt-5 pt-5">
            <h2 className="section-title-light">
              Operasyonel Mükemmellik İçin Her Şey Düşünüldü
            </h2>
            <Row className="mt-5 justify-content-center">
              <Col lg={4} md={6} className="mb-4">
                <FeatureCard
                  icon={<BsInbox size={24} />}
                  title="Birleşik Gelen Kutusu"
                  text="Tüm kanallardan gelen mesajları ve yorumları tek panelden yöneterek hiçbir satış fırsatını kaçırmayın."
                />
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <FeatureCard
                  icon={<BsLink45Deg size={24} />}
                  title="Satış Yapan Bio Link"
                  text="Instagram ve TikTok bio'nuzu, doğrudan alışveriş yapılabilir ürünler içeren bir vitrine dönüştürün."
                />
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <FeatureCard
                  icon={<BsBinoculars size={24} />}
                  title="Çok Kanallı Rakip Analizi"
                  text="Rakiplerinizin hem sosyal medya içeriklerini hem de reklam stratejilerini analiz ederek önde olun."
                />
              </Col>
            </Row>
          </AnimatedSection>
        </Container>
      </section>

      {/* Stil tanımlamaları */}
      <style>{`
        .features-section-light { background-color: #F7F9FC; color: #1A202C; padding: 100px 0; }
        .section-title-light { font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 700; color: #1A202C; }
        .section-subtitle-light { font-size: clamp(1rem, 2.5vw, 1.15rem); color: #4A5568; max-width: 700px; margin: 1rem auto 0; }
        
        /* Yeni Akış Diyagramı Stilleri */
        .problem-title { color: #C53030; font-weight: 600; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
        .flow-node {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 1.5rem;
          border-radius: 1rem;
          font-size: 1.2rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .flow-plus {
          font-size: 2rem;
          font-weight: 700;
          color: #A0AEC0;
        }
        .flow-arrow-container {
          margin: 1.5rem 0;
          color: #CBD5E0;
        }
        .flow-brand-box {
          background: linear-gradient(135deg, #5A67D8, #38B2AC);
          color: white;
          padding: 1rem 2rem;
          border-radius: 99px;
          font-size: 1.3rem;
          font-weight: 700;
          display: inline-block;
          box-shadow: 0 10px 20px -5px rgba(90, 103, 216, 0.4);
        }

        /* Statik Rapor Kartı Stilleri (öncekine benzer) */
        .report-card-static { background: #FFFFFF; border-radius: 1rem; padding: 2.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); width: 100%; }
        .report-header { text-align: center; margin-bottom: 2rem; }
        .report-header p { color: #5A67D8; font-weight: 700; letter-spacing: 1px; margin: 0; }
        .report-header h4 { font-size: 1.5rem; font-weight: 600; }
        .report-body { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem; }
        .channel-performance-static { text-align: center; border: 1px solid #E2E8F0; padding: 1.5rem; border-radius: 1rem; flex: 1; min-width: 280px; }
        .channel-title { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; margin-bottom: 1rem; }
        .channel-roi { font-size: 1.2rem; font-weight: 700; padding: 0.5rem 1rem; border-radius: 99px; display: inline-block; }
        .channel-roi.success { background-color: #C6F6D5; color: #2F855A; }
        .channel-roi.warning { background-color: #FEEBC8; color: #9B4225; }
        .report-footer { border-top: 1px solid #E2E8F0; padding-top: 2rem; margin-top: 1.5rem; text-align: center; }
        .metric-label { color: #718096; font-size: 0.9rem; }
        .metric-value { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: #1A202C; }
        .metric-value.accent { color: #2F855A; }
        
        /* Özellik Kartları Stilleri (öncekine benzer) */
        .feature-card-light { background-color: #FFFFFF; border: 1px solid #E2E8F0; padding: 2.5rem 2rem; border-radius: 1rem; text-align: left; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .feature-card-light:hover { transform: translateY(-8px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04); }
        .feature-icon-light { color: #FFFFFF; background-color: #5A67D8; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
        .feature-card-title-light { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
        .feature-card-text-light { color: #4A5568; line-height: 1.6; }
      `}</style>
    </>
  );
}

export default FeaturesSection;
