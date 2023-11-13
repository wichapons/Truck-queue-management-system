import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useEffect, useState } from "react";
import axios from "axios";

const QueuePageComponent = ({ getQueue }) => {

  const [queues, setQueues] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getQueue()
      .then((queues) => setQueues(queues))
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [refresh]);



  const sendLineNotification = async (queueID) => {
    const response = await axios.post(
      `/api/queue/send-message/${queueID}`
    );
    setRefresh(!refresh);
    return response.data;
  };


  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h2>Truck Queue Status</h2>
        <LinkContainer to="/admin/create-new-queue">
          <Button variant="warning">Add Queue</Button>
        </LinkContainer>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ประตู</th>
              <th>Create Time</th>
              <th>ลำดับคิว</th>
              <th>Supplier Code</th>
              <th>ประเภทสินค้า</th>
              <th>เวลาที่เรียกคิว</th>
              <th>เรียก Vendor เข้าประตู</th>
              <th>Vendor Checkin</th>
            </tr>
          </thead>
          <tbody>
            {queues.map((queue, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>

                <td>
                  {queue.createdAt
                    ? new Date(queue.createdAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Bangkok",
                        hour12: false,
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        
                      })
                    : "N/A"}
                </td>

                <td>{idx + 1}</td>
                <td>{queue.supplierCode}</td>
                <td>{queue.goodsType}</td>
                <td>
                  {queue.queueCalledTime
                    ? new Date(queue.queueCalledTime).toLocaleString("en-GB", {
                        timeZone: "Asia/Bangkok",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      }) + " น."
                    : "N/A"}
                </td>

                <td style={{ textAlign: "center" }}>
                  <Button
                    variant="primary"
                    className="btn-sm"
                    style={{ width: "30%" }}
                    onClick={() => sendLineNotification(queue._id)}
                    disabled={false}
                  >
                    <i className="bi bi-send"></i>
                  </Button>
                </td>

                <td style={{ textAlign: "center" }}>
                  <Button
                    variant="success"
                    className="btn-sm"
                    style={{ width: "60%" }}
                    onClick={() => closeJob()}
                    disabled={false}
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
