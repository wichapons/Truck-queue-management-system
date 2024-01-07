import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const HeaderComponent = () => {
  //import redux state
  const dispatch = useDispatch();
  //get userInfo from current redux state
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  //the category that will be display in the navbar when user select category from the list
  const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");
  //for sending to backend
  const [searchQuery, setSearchQuery] = useState("");
  //get messageReceived data from redux state
  const { messageReceived } = useSelector((state) => state.adminChat);

  const navigate = useNavigate();

  //send search query to backend when user press enter or click search
  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }
    e.preventDefault();
    if (searchQuery.trim()) {
      //remove space from user input
      if (searchCategoryToggle === "All") {
        navigate(`/product-list/search/${searchQuery}`);
      } else {
        navigate(
          `/product-list/category/${searchCategoryToggle.replaceAll(
            "/",
            ","
          )}/search/${searchQuery}`
        );
      }
    } else if (searchCategoryToggle !== "All") {
      navigate(
        `/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}`
      );
    } else {
      navigate("/product-list");
    }
  };

  //get msg from socketio server
  useEffect(() => {
  }, [userInfo.isAdmin]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        {/* use LinkContainer for render the specific page without reloading browser */}
        <LinkContainer to={userInfo.isRTVAdmin === false?("/admin/queue"):("admin/queue/rtv")}>
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
            {userInfo.name && userInfo.isAdmin === true && userInfo.isRTVAdmin === false ? (
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
                  <NavDropdown.Item href="/admin/users">User List</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="/login"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : userInfo.name && userInfo.isAdmin === true && userInfo.isRTVAdmin === true ? (
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
                  <NavDropdown.Item href="/admin/users">User List</NavDropdown.Item>
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
