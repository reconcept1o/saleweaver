import React from "react";
import { Container, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Profil</Card.Title>
          <Card.Text>
            <strong>Ad:</strong> {user?.name || "Bilinmiyor"} <br />
            <strong>Soyad:</strong> {user?.surname || "Bilinmiyor"} <br />
            <strong>E-posta:</strong> {user?.email || "Bilinmiyor"} <br />
            <strong>TC Kimlik No:</strong> {user?.tckn || "Bilinmiyor"} <br />
            <strong>Telefon:</strong> {user?.phone || "Bilinmiyor"}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
