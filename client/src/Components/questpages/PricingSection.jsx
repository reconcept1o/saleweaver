import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { BsCheckCircleFill } from "react-icons/bs";

// Şık ve Animasyonlu Fiyat Değiştirme Bileşeni
const PricingToggle = ({ isAnnual, setIsAnnual }) => {
  return (
    <div className="toggle-container" data-is-annual={isAnnual}>
      <span className={!isAnnual ? "active" : ""}>Aylık</span>
      <div className="toggle-switch" onClick={() => setIsAnnual(!isAnnual)}>
        <motion.div
          className="toggle-handle"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </div>
      <span className={isAnnual ? "active" : ""}>
        Yıllık <span className="discount-badge">%16 İndirim</span>
      </span>
    </div>
  );
};

// Fiyatlandırma Kartı
const PricingCard = ({ plan, isPopular, isAnnual }) => {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;
  const priceSuffix = isAnnual && typeof price === "number" ? "/yıl" : "/ay";

  return (
    <motion.div
      className={`pricing-card-wrapper ${isPopular ? "popular" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="pricing-card-dark h-100">
        {isPopular && <div className="popular-badge-dark">En Popüler</div>}
        <div className="plan-header-dark">
          <h3 className="plan-name-dark">{plan.name}</h3>
          <p className="plan-description-dark">{plan.description}</p>
          <div className="plan-price-dark">
            <span className="price-currency">
              {typeof price === "number" ? "₺" : ""}
            </span>
            <span className="price-amount-dark">{price}</span>
            <span className="price-suffix-dark">{priceSuffix}</span>
          </div>
        </div>
        <div className="plan-features-dark">
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>
                <BsCheckCircleFill className="feature-check-dark" />
                {/* Metni HTML olarak basmak için */}
                <span dangerouslySetInnerHTML={{ __html: feature }} />
              </li>
            ))}
          </ul>
        </div>
        <motion.button
          className={`plan-button-dark ${isPopular ? "primary" : "secondary"}`}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.2)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {plan.cta}
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- ANA BİLEŞEN ---
function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  // GÜNCELLENDİ: "AGENCY" planı kaldırıldı.
  const pricingPlans = [
    {
      name: "SOLO",
      description: "Bireysel içerik üreticileri ve yeni başlayanlar için.",
      price: { monthly: 299, annual: 2990 },
      features: [
        "3 Sosyal Medya Hesabı",
        "1 E-ticaret Entegrasyonu",
        "Görsel İçerik Planlayıcı",
        "Temel Performans Analizi",
        "Akıllı Link & Bio Sayfası",
      ],
      cta: "14 Gün Ücretsiz Dene",
    },
    {
      name: "BUSINESS",
      description: "KOBİ’ler, e-ticaret siteleri ve büyüyen markalar için.",
      price: { monthly: 699, annual: 6990 },
      features: [
        "10 Sosyal Medya Hesabı",
        "Sınırsız E-ticaret Entegrasyonu",
        "<strong>Satış & ROI Raporlaması</strong>",
        "Birleşik Gelen Kutusu",
        "3 Ekip Üyesi",
        "Rakip Analizi",
      ],
      cta: "14 Gün Ücretsiz Dene",
      isPopular: true,
    },
  ];

  return (
    <section id="pricing" className="pricing-section-dark">
      <Container>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title-dark">Size Uygun Planı Seçin</h2>
          <p className="section-subtitle-dark mt-3">
            Şeffaf fiyatlandırma. Gizli ücretler yok. İstediğiniz zaman iptal
            edin.
          </p>
          <div className="d-flex justify-content-center mt-5">
            <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          </div>
        </motion.div>

        {/* GÜNCELLENDİ: Grid yapısı 2 karta göre ayarlandı */}
        <Row className="justify-content-center align-items-stretch">
          {pricingPlans.map((plan, index) => (
            <Col key={index} lg={5} md={6} className="mb-5">
              <PricingCard
                plan={plan}
                isPopular={plan.isPopular}
                isAnnual={isAnnual}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <style>{`
        .pricing-section-dark {
          background-color: #0d1117;
          color: #e2e8f0;
          padding: 120px 0;
          position: relative;
          overflow: hidden;
        }
        .pricing-section-dark::before { content: ''; position: absolute; top: -20%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(90, 103, 216, 0.15), transparent 70%); z-index: 1; }
        .pricing-section-dark::after { content: ''; position: absolute; bottom: -20%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(56, 178, 172, 0.15), transparent 70%); z-index: 1; }
        .section-title-dark { font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 700; color: #FFFFFF; }
        .section-subtitle-dark { font-size: clamp(1rem, 2.5vw, 1.2rem); color: #A0AEC0; }
        
        .toggle-container { display: flex; align-items: center; gap: 1rem; background: rgba(255, 255, 255, 0.05); padding: 0.5rem; border-radius: 99px; font-weight: 500; color: #A0AEC0; }
        .toggle-container .active { color: #FFFFFF; font-weight: 600; }
        .toggle-switch { width: 50px; height: 28px; background: rgba(0,0,0,0.2); border-radius: 99px; display: flex; align-items: center; padding: 4px; cursor: pointer; justify-content: flex-start; }
        .toggle-container[data-is-annual="true"] .toggle-switch { justify-content: flex-end; }
        .toggle-handle { width: 20px; height: 20px; background-color: white; border-radius: 50%; }
        .discount-badge { background-color: #38B2AC; color: white; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.8rem; margin-left: 0.5rem; }

        .pricing-card-wrapper { position: relative; z-index: 2; height: 100%; }
        .pricing-card-wrapper.popular { transform: translateY(-20px); }
        
        .pricing-card-dark { background: rgba(26, 32, 44, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; padding: 2.5rem; display: flex; flex-direction: column; transition: all 0.3s ease; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); height: 100%; }
        .pricing-card-wrapper:hover .pricing-card-dark { border-color: rgba(255, 255, 255, 0.3); box-shadow: 0px 10px 30px rgba(0,0,0,0.2); }
        .popular-badge-dark { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background-image: linear-gradient(to right, #5A67D8, #38B2AC); color: white; padding: 0.4rem 1.2rem; border-radius: 99px; font-size: 0.9rem; font-weight: 600; }
        
        .plan-header-dark { text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .plan-name-dark { font-weight: 700; font-size: 1.5rem; color: #FFFFFF; }
        .plan-description-dark { color: #A0AEC0; font-size: 0.95rem; }
        .plan-price-dark { margin-top: 1rem; display: flex; align-items: baseline; justify-content: center;}
        .price-currency { font-size: 1.8rem; font-weight: 600; color: #A0AEC0; margin-right: 0.25rem; }
        .price-amount-dark { font-size: 3.5rem; font-weight: 800; color: #FFFFFF; }
        .price-suffix-dark { font-size: 1rem; color: #A0AEC0; margin-left: 0.5rem; }
        
        .plan-features-dark ul { list-style: none; padding: 0; margin-bottom: 2rem; }
        .plan-features-dark li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1.1rem; color: #CBD5E0; font-size: 1rem; }
        .feature-check-dark { color: #38B2AC; margin-top: 5px; flex-shrink: 0; }
        
        .plan-button-dark { font-weight: 600; padding: 0.9rem; border-radius: 0.75rem; border: none; width: 100%; margin-top: auto; cursor: pointer; }
        .plan-button-dark.primary { background-image: linear-gradient(to right, #5A67D8, #38B2AC); color: white; }
        .plan-button-dark.secondary { background-color: transparent; color: #FFFFFF; border: 2px solid rgba(255, 255, 255, 0.2); }
      `}</style>
    </section>
  );
}

export default PricingSection;
