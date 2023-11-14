import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

const AdminCreateProductPageComponent = () => {
  const [validated, setValidated] = useState(false);
  const [createProductResponseState, setCreateProductResponseState] = useState({
    message: "",
    error: "",
    queueId:"",
    supcode:"",
  });

  const createQueueApiRequest = async (formInputs) => {
    const { data } = await axios.post(`/api/queue/create`, {
      ...formInputs,
    });
    return data;
  };

  //handle product create button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const element = form.elements;
    //check input validity
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setValidated(true);

    // Extract form input values
    const formInputs = {
      supcode: element.supcode.value,
      supplierName: element.supName.value,
      goodstype: element.goodstype.value,
      queuenumber: element.queuenumber.value,
    };
    try {
      await createQueueApiRequest(formInputs).then((response) => {
        if (response.message) {
          setCreateProductResponseState({
            message: response.message,
            error: "",
            queueId: response.queueId,
            supcode: response.supcode,
            supName: response.supName,
            goodsType: response.goodsType,
            queueNumber: response.queueNumber,
          });
          //clear form
          form.reset();
          setValidated(true);
        } else {
          setCreateProductResponseState({
            message: response.message,
            error: response,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  //prevent submit form when user press enter
  const checkKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/orders" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>

        <Col md={6}>
          <h3 style={{ marginTop: "2.5%" }}>Create New Queue</h3>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Supplier Code</Form.Label>
              <Form.Control
                name="supcode"
                required
                type="number"
                inputMode="numeric"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control
                name="supName"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>ประเภทสินค้า</Form.Label>
              <Form.Control name="goodstype" required type="text" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>ลำดับคิว</Form.Label>
              <Form.Control name="queuenumber" required type="number" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create
            </Button>

            {createProductResponseState.message ? (
              <Alert variant="success" className="mt-3" >
                {createProductResponseState.message}
                <br/>
                Product Type: {createProductResponseState.goodsType}
                <br/>
                Vendor Code: {createProductResponseState.supcode}
                <br/>
                Vendor Name: {createProductResponseState.supName}
                <br/>
                Queue Number: {createProductResponseState.queueNumber}
              </Alert>
            ) : (
              ""
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCreateProductPageComponent;
