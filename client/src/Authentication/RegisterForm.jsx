import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, InputGroup, Alert } from "react-bootstrap";
import { validateTCKN } from "../Utils/validation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import axiosInstance from "../api/axiosInstance";

const initialFormData = {
  name: "",
  surname: "",
  email: "",
  tckn: "",
  password: "",
  confirmPassword: "",
};

function RegisterForm({ show, handleClose, handleShowLoginModal }) {
  const [formData, setFormData] = useState(initialFormData);
  const [phone, setPhone] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!show) {
      setFormData(initialFormData);
      setPhone("");
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
    if (!formData.name.trim()) newErrors.name = "Ad alanı zorunludur.";
    if (!formData.surname.trim()) newErrors.surname = "Soyad alanı zorunludur.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    if (!validateTCKN(formData.tckn)) {
      newErrors.tckn = "Geçersiz TC Kimlik Numarası.";
    }
    if (!phone || !isValidPhoneNumber(phone)) {
      newErrors.phone = "Lütfen geçerli bir telefon numarası giriniz.";
    }
    if (!formData.password) {
      newErrors.password = "Şifre alanı zorunludur.";
    } else if (
      formData.password.length < 12 ||
      !/[A-Z]/.test(formData.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      newErrors.password =
        "Şifre en az 12 karakter, 1 büyük harf ve 1 özel karakter içermeli.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler uyuşmuyor.";
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
      const response = await axiosInstance.post("/api/auth/register", {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        tckn: formData.tckn,
        phone,
        password: formData.password,
      });
      dispatch(
        setAuth({
          isAuthenticated: true,
          user: response.data.user,
        })
      );
      handleClose();
      handleShowLoginModal();
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Kayıt olurken bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {serverError && (
        <Alert variant="danger" onClose={() => setServerError("")} dismissible>
          {serverError}
        </Alert>
      )}
      <Row className="gx-2">
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!formErrors.name}
              placeholder="Adınız"
              required
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formSurname">
            <Form.Control
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              isInvalid={!!formErrors.surname}
              placeholder="Soyadınız"
              required
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.surname}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

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

      <Form.Group className="mb-3" controlId="formPhone">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="TR"
          value={phone}
          onChange={setPhone}
          className={formErrors.phone ? "is-invalid" : ""}
          placeholder="Telefon Numaranız"
          disabled={isLoading}
        />
        {formErrors.phone && (
          <div className="invalid-feedback d-block">{formErrors.phone}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTckn">
        <Form.Control
          type="text"
          name="tckn"
          maxLength="11"
          value={formData.tckn}
          onChange={handleChange}
          isInvalid={!!formErrors.tckn}
          placeholder="TC Kimlik Numaranız"
          required
          disabled={isLoading}
        />
        <Form.Control.Feedback type="invalid">
          {formErrors.tckn}
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
            placeholder="Şifre"
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

      <Form.Group className="mb-4" controlId="formConfirmPassword">
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            isInvalid={!!formErrors.confirmPassword}
            placeholder="Şifrenizi Doğrulayın"
            required
            disabled={isLoading}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            <small>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</small>
          </Button>
          <Form.Control.Feedback type="invalid">
            {formErrors.confirmPassword}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <div className="d-grid">
        <Button
          type="submit"
          size="lg"
          className="register-btn"
          disabled={isLoading}
        >
          {isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
        </Button>
      </div>
    </Form>
  );
}

export default RegisterForm;
