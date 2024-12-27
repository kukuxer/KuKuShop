import { useAuth0 } from "@auth0/auth0-react";
import { Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useMediaQuery } from "react-responsive";

function NavBar() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Navbar expand="md" className="bg-body-tertiary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
          <i
            className="bi bi-ban"
            style={{ fontSize: "1.5rem", marginRight: "8px" }}
          ></i>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            KuKushop
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAuthenticated && (
              <Nav.Link href="/profile" onClick={() => loginWithRedirect()}>
                Log in
              </Nav.Link>
            )}
            {isAuthenticated && user && (
              <>
                {isMobile ? (
                  <>
                    <Nav.Link href="/profile">
                    <img
                          src={user.picture || ""}
                          alt="Profile"
                          className="rounded-circle"
                          width="30"
                          height="30"
                          style={{ marginRight: "8px" }}
                        />
                    {user.name}
                    </Nav.Link>
                    <Nav.Link onClick={() => logoutWithRedirect()}>Log out</Nav.Link>
                  </>
                ) : (
                  <NavDropdown
                    title={
                      <span>
                        <img
                          src={user.picture || ""}
                          alt="Profile"
                          className="rounded-circle"
                          width="30"
                          height="30"
                          style={{ marginRight: "8px" }}
                        />
                        {user.name}
                      </span>
                    }
                    id="profile-dropdown"
                  >
                    <NavDropdown.Item href="/profile">
                      <i
                        className="bi bi-person-fill"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => logoutWithRedirect()}>
                      <i
                        className="bi bi-box-arrow-right"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          
          <Form
            className="d-none d-md-flex mx-auto"
            style={{ maxWidth: "400px" }}
          >
            <Form.Control
              type="text"
              placeholder="Search your product"
              className="me-2"
            />
          </Form>

          <Nav className="ms-auto">
            <Nav.Link href="#link">
              <i
                className="bi bi-heart-fill"
                style={{ marginRight: "8px" }}
              ></i>
              Favourites
            </Nav.Link>
            <Nav.Link href="#link">
              <i className="bi bi-basket" style={{ marginRight: "8px" }}></i>
              Basket
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
