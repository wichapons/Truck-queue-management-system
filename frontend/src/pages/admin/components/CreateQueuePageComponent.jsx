import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";

const AdminCreateProductPageComponent = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createProductResponseState, setCreateProductResponseState] = useState({
    message: "",
    error: "",
    queueId: "",
    supcode: "",
  });
  const [numPairs, setNumPairs] = useState(0);

  const createQueueApiRequest = async (formInputs) => {
    const { data } = await axios.post(`/api/queue/create`, {
      ...formInputs,
    });
    return data;
  };

  const checkVendorCodeApiRequest = async (supplierId) => {
    try {
      const { data } = await axios.get(`/api/suppliers/${supplierId}`);
      return data;
    } catch (err) {
      console.log(err);
      alert("ไม่พบรหัส Supplier นี้ในระบบ");
    }
  };

  //handle product create button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const element = form.elements;

    if (element.goodstype.value === "เลือกประเภทเอกสาร") {
      alert("กรุณาเลือกประเภทเอกสาร");
      return;
    }

    //check input validity
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setValidated(true);

    // Extract form input values from multiple supplier input
    const suppliers = [];
    for (let i = 0; i < numPairs; i++) {
      suppliers.push({
        supplierCode: element[`supcode${i}`].value,
        supplierName: element[`supName${i}`].value,
      });
    }
    
    suppliers.push({
      supplierCode: element.supcode.value,
      supplierName: element.supName.value,
    })
    const formInputs = {
      suppliers,
      goodstype: element.goodstype.value,
      queuenumber: element.queuenumber.value,
      isRTV: element.rtv.checked // Set isRTV to true if the checkbox is checked, otherwise false
    };
    try {
      setLoading(true);
      await createQueueApiRequest(formInputs).then((response) => {
        if (response.message) {
          setCreateProductResponseState({
            message: response.message,
            error: "",
            queueId: response.queueId,
            suppliers: response.suppliers,
            goodsType: response.goodsType,
            queueNumber: response.queueNumber,
          });
          //clear form
          form.reset();
          setLoading(false);
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
      alert("An error occurred. Please try again.");
    }
  };

  //prevent submit form when user press enter
  const checkKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const checkVendorCode = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const form = e.currentTarget.form;
      const element = form.elements;
      const supplierId = element.supcode.value;

      try {
        checkVendorCodeApiRequest(supplierId).then((response) => {
          if (response.status === 404) {
            alert("ไม่พบรหัส Supplier นี้ในระบบ");
          }
          if (response.sp_name) {
            element.supName.value = response.sp_name;
          } else {
            alert("ไม่พบรหัส Supplier นี้ในระบบ");
          }
        });
      } catch (err) {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const checkMutipleVendorCode = (e, index) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const form = e.currentTarget.form;
      const element = form.elements;
      
      // Get the supplier code and name input fields based on the index
      const supplierId = element[`supcode${index}`].value;
      const supNameField = element[`supName${index}`];
  
      try {
        checkVendorCodeApiRequest(supplierId).then((response) => {
          if (response.status === 404) {
            alert("ไม่พบรหัส Supplier นี้ในระบบ");
          }
          if (response.sp_name) {
            supNameField.value = response.sp_name;
          } else {
            alert("ไม่พบรหัส Supplier นี้ในระบบ");
          }
        });
      } catch (err) {
        alert("An error occurred. Please try again.");
      }
    }
  };

  // Function to handle change in the checkbox
  const handleMultipleVendorChange = (e) => {
    /*
    let numberOfSupInput = Number(prompt("please enter number of suppliers input"));
    if (numberOfSupInput === null || isNaN(numberOfSupInput)){
      return;
    }
    */

    setNumPairs(
      e.target.checked ? Number(prompt("กรุณาใส่จำนวนผู้ขนส่งที่ต้องการเพิ่ม")): 0
    ); // Change the number of pairs based on checkbox state
  };

  const renderSupplierInputs = () => {
    const inputs = [];
    for (let i = 0; i < numPairs; i++) {
      inputs.push(
        <div key={i}>
          <Form.Group className="mb-3" controlId={`formBasicCode${i}`}>
            <Form.Label>รหัสผู้ขนส่ง {i+2} (กด Enter เพื่อค้นหาชื่อผู้ขนส่ง)</Form.Label>
            <Form.Control
              name={`supcode${i}`}
              required
              type="number"
              inputMode="numeric"
              onKeyDown={(e) => checkMutipleVendorCode(e,i)}
            />
          </Form.Group> 
          <Form.Group className="mb-3" controlId={`formBasicName${i}`}>
            <Form.Label>ชื่อผู้ขนส่ง {i+2}</Form.Label>
            <Form.Control name={`supName${i}`} required />
          </Form.Group>
        </div>
      );
    }
    return inputs;
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1} className="ml-6">
          <Link to="/admin/queue" className="btn btn-warning my-3 ">
            Go Back
          </Link>
        </Col>

        <Col md={6}>
          <h3 style={{ marginTop: "2.5%" }}>Create New Queue</h3>
          <Form
            noValidate
            onSubmit={handleSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >

          {/* CHECKBOX SECTION */}
          
            <Row md={3}>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  name="multipleVendors"
                  type="checkbox"
                  label="เพิ่มช่องผู้ขนส่ง"
                  onChange={handleMultipleVendorChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox2">
                <Form.Check name="rtv" type="checkbox" label="RTV" />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>รหัสผู้ขนส่ง (กด Enter เพื่อค้นหาชื่อผู้ขนส่ง) </Form.Label>
              
              <Form.Control
                name="supcode"
                required
                type="number"
                inputMode="numeric"
                onKeyDown={(e) => {
                  checkVendorCode(e);
                }}
              />
              
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>ชื่อผู้ขนส่ง</Form.Label>
              <Form.Control name="supName" required />
            </Form.Group>

            {/* Render Supplier Code and Supplier Name inputs based on the number of pairs */}
          {renderSupplierInputs()}

            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>ประเภทเอกสาร</Form.Label>
              {/* <Form.Control name="goodstype" required type="text" /> */}
              <Form.Select
                required
                name="goodstype"
                aria-label="Default select example"
                type="text"
                placeholder="Open this select menu"
              >
                <option disabled selected>
                  เลือกประเภทเอกสาร
                </option>
                <option value="Consignment">Consignment</option>
                <option value="Credit">Credit</option>
                <option value="Beautrium">Beautrium</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>ลำดับคิว</Form.Label>
              <Form.Control name="queuenumber" required type="number" />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Create"
              )}
            </Button>

            {createProductResponseState.message ? (
              <Alert variant="success" className="mt-3">
                {createProductResponseState.message}:{" "}
                {new Date().toLocaleString("en-GB", {
                  timeZone: "Asia/Bangkok",
                  hour12: false,
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                น.
                <br />
                Document Type: {createProductResponseState.goodsType}
                <br />
                Supplier Code: {createProductResponseState.suppliers.map((supplier)=>{
                  return supplier.supplierCode + ', '
                })}
                <br />
                Supplier Name: {createProductResponseState.suppliers.map((supplier)=>{
                  return supplier.supplierName
                })}
                <br />
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
