import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FooterComponent = () => {
  //get current year
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container fluid>
        <Row>
          <Col className="bg-dark text-white text-center py-3">
            Copyright &copy; {currentYear} Wichapon V.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
