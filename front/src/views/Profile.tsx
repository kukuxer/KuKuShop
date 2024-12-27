import React from "react";
import { Container, Row, Col } from "reactstrap";



import { useAuth0, withAuthenticationRequired, User } from "@auth0/auth0-react";
import Loading from "../components/Loading";

export const ProfileComponent: React.FC = () => {
  const { user } = useAuth0();

  // Ensure `user` is typed
  const typedUser = user as User;

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={typedUser.picture || ""}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{typedUser.name}</h2>
          <p className="lead text-muted">{typedUser.email}</p>
        </Col>
      </Row>
      <Row>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
