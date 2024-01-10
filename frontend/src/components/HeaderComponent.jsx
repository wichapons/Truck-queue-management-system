import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../redux/actions/userActions";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const HeaderComponent = () => {
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`/api/users/profile`);
        const updatedUserInfo = response.data;

        // Update userInfo in local state
        setUserInfo(updatedUserInfo);

      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    // Check if userInfo is an empty object before fetching
    if (Object.keys(userInfo).length === 0) {
      getUserInfo();
    }
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        {/* use LinkContainer for render the specific page without reloading browser */}
        <LinkContainer
          to={
            userInfo.isRTVAdmin === false ? "/admin/queue" : "admin/queue/rtv"
          }
        >
          <Navbar.Brand>
            <i className="bi bi-bus-front-fill"></i> Truck Queue Management
            System{" "}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-center"
        >
          <Nav>
            {userInfo.name &&
            userInfo.isAdmin === true &&
            userInfo.isRTVAdmin === false ? (
              <>
                <Nav className="justify-content-center">
                  <LinkContainer to="/admin/queue">
                    <Nav.Link className="active">Home</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/queue/rtv">
                    <Nav.Link className="active">RTV</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/queue/history">
                    <Nav.Link className="active">History</Nav.Link>
                  </LinkContainer>
                </Nav>

                <NavDropdown
                  title={userInfo.name + " " + userInfo.lastName}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/admin/users">
                    User List
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="/login"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : userInfo.name &&
              userInfo.isAdmin === true &&
              userInfo.isRTVAdmin === true ? (
              <>
                <Nav className="justify-content-center">
                  <LinkContainer to="/admin/queue/rtv">
                    <Nav.Link className="active">RTV</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/queue/history">
                    <Nav.Link className="active">History</Nav.Link>
                  </LinkContainer>
                </Nav>

                <NavDropdown
                  title={userInfo.name + " " + userInfo.lastName}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/admin/users">
                    User List
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="/login"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Login </Nav.Link>
                {/* <Nav.Link href="/register">Register </Nav.Link> */}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
