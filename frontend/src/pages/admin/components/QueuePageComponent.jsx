import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useEffect, useState } from "react";
import axios from "axios";

const QueuePageComponent = ({ getOrders }) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    getOrders()
      .then((orders) => setOrders(orders))
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, []);

  const sendLineNotification = async () => {
    const response = await axios.post(`http://localhost:8796/api/send-message`);
    console.log(`test111 ${response}`);
    return response.data
  }

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1>Truck Queue Status</h1>
        <LinkContainer to="/admin/create-new-queue">
            <Button variant="warning" >Add Queue</Button>
          </LinkContainer>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ประตู</th>
              <th>Timestamp</th>
              <th>ลำดับคิว</th>
              <th>Supplier Code</th>
              <th>Supplier Name</th>
              <th>ประเภทสินค้า</th>
              <th>เวลาที่เรียกคิว</th>
              <th>เรียก Vendor เข้าประตู</th>
              <th>Vendor Checkin</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>

                <td>{idx + 1}</td>
  
                <td>
                {order.createdAt ? order.createdAt.substring(0, 16) : 'N/A'}
                </td>

                <td>{idx + 1}</td>

                <td>{15263}</td>
                <td>L.M.E.</td>


                <td>GIC Consign</td>
                <td>{order.createdAt ? order.createdAt.substring(0, 16) : 'N/A'}</td>

                <td style={{ textAlign: "center" }}>
                  <Button
                    variant="primary"
                    className="btn-sm"
                    style={{ width: "30%"}}
                    onClick={()=>sendLineNotification()}
                    disabled= {true}
                  >
                    <i className="bi bi-send"></i>
                  </Button>
                </td>

                <td style={{textAlign:"center"}}>
                <Button
                    variant="success"
                    className="btn-sm"
                    style={{ width: "80%"}}
                    onClick={()=>closeJob()}
                    disabled= {true}
                  >
                    <i className="bi bi-check-circle"></i>
                  </Button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default QueuePageComponent;
