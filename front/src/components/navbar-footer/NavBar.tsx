import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useMediaQuery } from "react-responsive";
import Profile from "../../entity/Profile";

function NavBar() {
  const { user, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently  } = useAuth0();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const url = import.meta.env.VITE_BACKEND_URL;
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

    const fetchProtectedData = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log(token);
        console.log(url);
        console.log(user);

        const response = await fetch(`${url}/api/profile/get`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user?.name,
            email: user?.email,
            nickname: user?.nickname,
            familyName: user?.family_name,
            givenName: user?.given_name,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        const userProfile = new Profile(
          data.email,  
          data.name,   
          data.nickname || "",
          data.givenName || "", 
          data.familyName || "",  
          data.role || "Guest" 
        );
        setProfile(userProfile);
        console.log("response", data);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };

    useEffect(() => {
      if (isAuthenticated) {
        fetchProtectedData();
      }
    }, [isAuthenticated,user]);

    useEffect(() => {
      if (profile) {
        console.log("Updated Profile:", profile);
      }
    }, [profile]);
  

  
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
