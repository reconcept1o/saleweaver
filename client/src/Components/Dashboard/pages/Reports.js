import React from "react";
import { Container, Card } from "react-bootstrap";

function Reports() {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Raporlar</Card.Title>
          <Card.Text>
            Bu, raporlar sayfasıdır. Kullanıcıya ait raporlar veya istatistikler
            burada listelenebilir.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Reports;
