import React, { useState, useEffect } from "react";
import { Navbar, Container, Modal } from "react-bootstrap";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion"; // YENİ: Animasyon için import edildi
import { logout } from "../store/authSlice.js";
import LoginForm from "../Authentication/LoginForm";
import RegisterForm from "../Authentication/RegisterForm";
import NotificationBell from "./NotificationBell.jsx";

import SaleweaverLogo from "../Assests/logosale.png";

// --- İkonlar (Değişiklik yok) ---
const RegisterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="me-2"
  >
    <path
      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const LogoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="me-2"
  >
    <path
      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17L21 12L16 7"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12H9"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Header() {
  // State ve hook'larda değişiklik yok
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [scrolled, setScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoginHovered, setLoginHovered] = useState(false);
  const [isRegisterHovered, setRegisterHovered] = useState(false);
  const [isLogoutHovered, setLogoutHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stil objelerinde değişiklik yok
  const colors = {
    text: "#000000",
    textHover: "#555555",
    accent: "#FBD041",
    accentHover: "#ecca3e",
    subtleBg: "rgba(255, 255, 255, 0.75)",
    shadow: "rgba(0, 0, 0, 0.1)",
  };
  const navLinks = [
    { to: "features", label: "Özellikler" },
    { to: "how-it-works", label: "Nasıl Çalışır?" },
    { to: "pricing", label: "Fiyatlandırma" },
  ];

  // useEffect ve diğer fonksiyonlarda değişiklik yok
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      scroll.scrollToTop({ smooth: true, duration: 500 });
    }
  };

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowRegisterModal = () => setShowRegisterModal(true);
  const handleCloseRegisterModal = () => setShowRegisterModal(false);
  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/");
    });
  };

  const headerWrapperStyle = {
    transition: "transform 0.4s ease-in-out",
    transform: isHeaderVisible ? "translateY(0)" : "translateY(-120%)",
    padding: "0.5rem 0",
  };
  const headerContainerBaseStyle = {
    transition: "all 0.4s ease-in-out",
    width: "100%",
  };
  const headerContainerScrolledStyle = {
    backgroundColor: colors.subtleBg,
    backdropFilter: "blur(16px)",
    boxShadow: `0 6px 20px ${colors.shadow}`,
    borderRadius: "50px",
    padding: "0.5rem 1.5rem",
    marginTop: "0.5rem",
    maxWidth: "1200px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };
  const primaryButtonStyle = {
    backgroundColor: colors.accent,
    color: colors.text,
    border: "none",
    borderRadius: "50px",
    padding: "0.7rem 1.4rem",
    fontWeight: 600,
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
  };
  const primaryButtonHoverStyle = { backgroundColor: colors.accentHover };
  const secondaryButtonStyle = {
    backgroundColor: "transparent",
    color: colors.text,
    border: "none",
    borderRadius: "50px",
    padding: "0.7rem 1.4rem",
    fontWeight: 600,
    transition: "background-color 0.3s ease",
  };
  const secondaryButtonHoverStyle = { backgroundColor: "rgba(0, 0, 0, 0.05)" };

  const DesktopNav = () => (
    <div className="d-flex justify-content-between align-items-center w-100">
      <div className="flex-grow-1 d-flex justify-content-start">
        {/* YENİ: Animasyonlu Logo ve Marka Adı */}
        <motion.div
          style={{ display: "inline-block", cursor: "pointer" }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={scrollToTop}
        >
          <Navbar.Brand
            className="d-flex align-items-center fw-bold fs-4"
            style={{ color: colors.text }}
          >
            <img
              src={SaleweaverLogo}
              height="50" // Büyütüldü
              className="d-inline-block align-top me-2"
              alt="Saleweaver Logo"
            />
            Saleweaver
          </Navbar.Brand>
        </motion.div>
      </div>

      {isAuthenticated ? (
        <div className="flex-grow-1 d-flex justify-content-end align-items-center gap-3">
          <NotificationBell />
          <button
            style={{
              ...secondaryButtonStyle,
              ...(isLogoutHovered && secondaryButtonHoverStyle),
            }}
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
            onClick={handleLogout}
          >
            <LogoutIcon /> Çıkış Yap
          </button>
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-center gap-5">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                spy
                smooth
                offset={-120}
                duration={500}
                className="nav-link-desktop"
                activeClass="active"
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>
          <div className="flex-grow-1 d-flex justify-content-end align-items-center gap-2">
            <button
              style={{
                ...secondaryButtonStyle,
                ...(isLoginHovered && secondaryButtonHoverStyle),
              }}
              onMouseEnter={() => setLoginHovered(true)}
              onMouseLeave={() => setLoginHovered(false)}
              onClick={handleShowLoginModal}
            >
              Giriş Yap
            </button>
            <button
              style={{
                ...primaryButtonStyle,
                ...(isRegisterHovered && primaryButtonHoverStyle),
              }}
              onMouseEnter={() => setRegisterHovered(true)}
              onMouseLeave={() => setRegisterHovered(false)}
              onClick={handleShowRegisterModal}
            >
              {" "}
              <RegisterIcon /> Kayıt Ol
            </button>
          </div>
        </>
      )}
    </div>
  );

  const MobileNav = () => (
    <div className="d-flex justify-content-between align-items-center w-100">
      {/* YENİ: Animasyonlu Mobil Logo ve Marka Adı */}
      <motion.div
        style={{ display: "inline-block", cursor: "pointer" }}
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={scrollToTop}
      >
        <Navbar.Brand
          className="d-flex align-items-center fw-bold fs-5"
          style={{ color: colors.text }}
        >
          <img
            src={SaleweaverLogo}
            height="32" // Büyütüldü
            className="d-inline-block align-top me-2"
            alt="Saleweaver Logo"
          />
          Saleweaver
        </Navbar.Brand>
      </motion.div>
      <div className="d-flex align-items-center gap-2">
        {isAuthenticated ? (
          <>
            <NotificationBell />
            <button
              style={{
                ...secondaryButtonStyle,
                padding: "0.5rem 0.8rem",
                fontSize: "0.9rem",
              }}
              onClick={handleLogout}
            >
              <LogoutIcon />
            </button>
          </>
        ) : (
          <>
            <button
              style={{
                ...secondaryButtonStyle,
                padding: "0.5rem 0.8rem",
                fontSize: "0.9rem",
              }}
              onClick={handleShowLoginModal}
            >
              Giriş Yap
            </button>
            <button
              style={{
                ...primaryButtonStyle,
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
              }}
              onClick={handleShowRegisterModal}
            >
              Kayıt Ol
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar fixed="top" style={headerWrapperStyle}>
        <Container
          style={{
            ...headerContainerBaseStyle,
            ...(scrolled ? headerContainerScrolledStyle : {}),
          }}
        >
          {isMobile ? <MobileNav /> : <DesktopNav />}
        </Container>
      </Navbar>

      {/* Modallarda ve stillerde değişiklik yok */}
      <Modal
        show={showLoginModal}
        onHide={handleCloseLoginModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Giriş Yap</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm
            show={showLoginModal}
            handleClose={handleCloseLoginModal}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showRegisterModal}
        onHide={handleCloseRegisterModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Kayıt Ol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm
            show={showRegisterModal}
            handleClose={handleCloseRegisterModal}
            handleShowLoginModal={handleShowLoginModal}
          />
        </Modal.Body>
      </Modal>

      <style>{`
        .nav-link-desktop { position: relative; padding: 0.5rem 0; cursor: pointer; font-size: 0.95rem; font-weight: 600; color: ${colors.text}; text-decoration: none; transition: color 0.3s ease; }
        .nav-link-desktop::after { content: ''; position: absolute; width: 100%; height: 2px; bottom: 0; left: 0; background-color: ${colors.accent}; transform: scaleX(0); transform-origin: bottom right; transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1); }
        .nav-link-desktop:hover::after, .nav-link-desktop.active::after { transform: scaleX(1); transform-origin: bottom left; }
        .nav-link-desktop.active { color: ${colors.textHover}; }
        .modal-content { border-radius: 15px; border: none; box-shadow: 0 4px 20px ${colors.shadow}; }
        .modal-header { border-bottom: none; padding: 1.5rem; }
        .modal-title { font-weight: 600; color: ${colors.text}; }
        .modal-body { padding: 1.5rem; }
        .modal-footer { border-top: none; padding: 1rem 1.5rem; }
        .login-btn, .register-btn { background-color: ${colors.accent}; border: none; border-radius: 50px; padding: 0.7rem 1.4rem; font-weight: 600; transition: background-color 0.3s ease; }
        .login-btn:hover, .register-btn:hover { background-color: ${colors.accentHover}; }
      `}</style>
    </>
  );
}

export default Header;
