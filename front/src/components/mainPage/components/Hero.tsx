import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaShoppingBag, FaInfoCircle } from "react-icons/fa";

const HeroSection = () => {
  const handleShopClick = () => {
    console.log("Shop Now clicked");
  };

  const handleLearnClick = () => {
    console.log("Learn More clicked");
  };

  return (
    <div className="bg-dark text-white d-flex align-items-center  py-5">
      <Container className="text-center">
        <div className="mb-5">
          <h1 className="display-4 fw-bold mb-3">KuKuShop</h1>
          <div
            className="mx-auto"
            style={{
              width: "100px",
              height: "4px",
              backgroundColor: "#6f42c1",
              borderRadius: "4px",
            }}
          ></div>
        </div>

        <p className="lead mb-5">
          Explore KuKuShop, the global marketplace where buying and selling have
          no limits. Trade essentials and unique finds seamlessly, connecting
          people worldwide.
        </p>

        <div className="d-flex justify-content-center gap-3 mb-5 flex-column flex-sm-row">
          <Button
            onClick={handleShopClick}
            variant="primary"
            size="lg"
            className="d-flex align-items-center justify-content-center px-4"
            style={{
              backgroundColor: "#6f42c1",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <FaShoppingBag className="me-2" />
            Shop Now
          </Button>
          <Button
            onClick={handleLearnClick}
            variant="outline-primary"
            size="lg"
            className="d-flex align-items-center justify-content-center px-4"
            style={{
              color: "#6f42c1",
              borderColor: "#6f42c1",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseOver={(e) => {
              const button = e.target as HTMLButtonElement; // Type assertion to HTMLButtonElement
              button.style.backgroundColor = "#6f42c1";
              button.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              const button = e.target as HTMLButtonElement; // Type assertion to HTMLButtonElement
              button.style.backgroundColor = "transparent";
              button.style.color = "#6f42c1";
            }}
          >
            <FaInfoCircle className="me-2" />
            Learn More
          </Button>
        </div>

        <Row className="g-4">
          <Col sm={4}>
            <Card className="bg-secondary text-white text-center border-0">
              <Card.Body>
                <Card.Title className="fw-bold">Fast Shipping</Card.Title>
                <Card.Text>
                  {" "}
                  Free delivery within 2-3 business days across all the Europe
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={4}>
            <Card className="bg-secondary text-white text-center border-0">
              <Card.Body>
                <Card.Title className="fw-bold">Unmatched Variety</Card.Title>
                <Card.Text>
                  Discover an extensive range of products to suit every need and
                  style.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={4}>
            <Card className="bg-secondary text-white text-center border-0">
              <Card.Body>
                <Card.Title className="fw-bold">24/7 Support</Card.Title>
                <Card.Text>Always here to help you</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
