import { Row, Col, Container, Form, Button, CloseButton, Table, Alert} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeCategory,
  setValuesForAttrFromDbSelectForm,
  setAttributesTableWrapper,
} from "./utils/utils";
import { Fragment } from "react";

const AdminCreateProductPageComponent = ({
  createProductApiRequest,
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
  categories,
  reduxDispatch,
  newCategory,
  deleteCategory,
  saveAttributeToCatDoc,
}) => {
  const [validated, setValidated] = useState(false);
  const [attributesTable, setAttributesTable] = useState([]);
  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const [images, setImages] = useState(false);
  const [isCreating, setIsCreating] = useState("");
  const [createProductResponseState, setCreateProductResponseState] = useState({
    message: "",
    error: "",
  });

  const [categoryChoosen, setCategoryChoosen] = useState("Choose category");
  const [trigger, setTrigger] = useState(false);
  //create ref for attr key and value
  const attrVal = useRef(null);
  const attrKey = useRef(null);

  const navigate = useNavigate();

  //handle product create button
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const element = form.elements;
    // Extract form input values
    const formInputs = {
      name: element.name.value,
      description: element.description.value,
      count: element.count.value,
      price: element.price.value,
      category: element.category.value,
      attributesTable: attributesTable,
    };

    setValidated(true);
  };

  //prevent submit form when user press enter
  const checkKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
    };
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/orders" className="btn btn-info my-3" >
            Go Back
          </Link>
        </Col>

        <Col md={6}>
          <h1 style={{marginTop:"1.5%"}}>Create New Queue</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e)=>checkKeyDown(e)}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Supplier Code</Form.Label>
              <Form.Control name="supcode" required type="number" inputMode="numeric" />
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
            {createProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCreateProductPageComponent;
