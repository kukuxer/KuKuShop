import React from "react";
import { Container, Row, Col, Button } from "reactstrap";

const Hero: React.FC = () => {
  return (
    <div className="hero-section text-center text-white" style={heroStyle}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-md-left">
            <h1 className="display-3 font-weight-bold">KuKuShop</h1>
            <p className="lead">Shop for Everyone! </p>
            <Button color="primary" size="lg" href="/shop">
              Start Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #007bff, #6610f2)",
  padding: "4rem 0",
  color: "white",
};

export default Hero;
