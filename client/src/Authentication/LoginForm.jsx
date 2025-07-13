import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Yönlendirme için import
import { setAuth, updateFCMToken } from "../store/authSlice";
import axiosInstance from "../api/axiosInstance";
import { fetchFCMToken } from "../firebase.js";

function LoginForm({ show, handleClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook'unu tanımla

  useEffect(() => {
    if (!show) {
      setFormData({ email: "", password: "" });
      setFormErrors({});
      setServerError("");
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    if (!formData.password) {
      newErrors.password = "Şifre alanı zorunludur.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
        deviceInfo: navigator.userAgent,
      });
      dispatch(
        setAuth({
          isAuthenticated: true,
          user: response.data.user,
        })
      );

      // FCM token al ve backend'e gönder
      const fcmToken = await fetchFCMToken();
      if (fcmToken) {
        dispatch(updateFCMToken({ fcmToken, deviceInfo: navigator.userAgent }));
      } else {
        setServerError(
          "Bildirim izni verilmedi, bildirimler etkinleştirilemedi."
        );
      }

      // Önce modal'ı kapat, sonra yönlendir
      handleClose();
      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Giriş yapılırken bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google ile giriş butonuna tıklandı.");
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {serverError && (
        <Alert variant="danger" onClose={() => setServerError("")} dismissible>
          {serverError}
        </Alert>
      )}
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!formErrors.email}
          placeholder="E-posta Adresiniz"
          required
          disabled={isLoading}
        />
        <Form.Control.Feedback type="invalid">
          {formErrors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!formErrors.password}
            placeholder="Şifreniz"
            required
            disabled={isLoading}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <small>{showPassword ? <FaEyeSlash /> : <FaEye />}</small>
          </Button>
          <Form.Control.Feedback type="invalid">
            {formErrors.password}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <div className="d-grid">
        <Button
          type="submit"
          size="lg"
          className="login-btn"
          disabled={isLoading}
        >
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
        <Button
          variant="outline-danger"
          size="lg"
          className="mt-3"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Google ile Giriş Yap
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
