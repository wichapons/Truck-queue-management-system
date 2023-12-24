import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import Spinner from "react-bootstrap/Spinner";

const QueuePageComponent = ({ getQueue }) => {
  const [queues, setQueues] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [productType, setProductType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get productType from user info
        const tokenResponse = await axios.get("/api/get-token");
        
        if (!tokenResponse.data) {
          alert("Cannot get access token");
          return;
        }
  
        setProductType(tokenResponse.data.productType);
        setLoading(true);
  
        // Fetch data from DB based on product type
        const queues = await getQueue(tokenResponse.data.productType);
  
        // Sort by queue number ASC
        const sortedQueues = [...queues].sort((a, b) => a.queueNumber - b.queueNumber);
        
        setQueues(sortedQueues);
      } catch (error) {
        console.error(
          error.response.data.message
            ? error.response.data.message
            : error.response.data
        );
      }
    };
    fetchData();
  }, [refresh]);

  const sendLineNotification = async (queueID, dockingDoorNumber) => {
    setIsSending(true);
    if (!dockingDoorNumber) {
      alert("กรุณากรอกเลขประตูที่เรียกคิว ก่อนที่จะเรียก Vendor เข้าประตูค่ะ");
      setIsSending(false);
      return "cancel";
    }
    const response = await axios.post(`/api/queue/send-message/${queueID}`);
    setIsSending(false);
    setRefresh(!refresh);
    return response.data;
  };

  const closeQueue = async (queueID, dockingDoorNumber) => {
    if (!dockingDoorNumber) {
      alert("กรุณาเลือกประตูที่เรียกคิว ก่อนที่จะปิดงานค่ะ");
      return "cancel";
    }
    const response = await axios.put(`/api/queue/close/${queueID}`);
    // Set the specific button to be disabled
    setRefresh(!refresh);

    return response.data;
  };

  const checkOut = async (queueID, isCheckin) => {
    if (!isCheckin) {
      alert("กรุณากด Check in ก่อน Check out ค่ะ");
      return "cancel";
    }

    if (window.confirm("ยืนยันการปิดงาน?")) {
      const response = await axios.put(`/api/queue/checkout/${queueID}`);
      // Set the specific button to be disabled
      setRefresh(!refresh);
      return response.data;
    } else {
      return "cancel";
    }
  };

  const assignDockingDoor = async (queueID) => {
    //show alert with input field
    const dockingDoorNumber = prompt("กรุณากรอกเลขประตูที่เรียกคิว");

    // check dockingDoorNumber is not empty
    if (dockingDoorNumber) {
      const response = await axios.put(
        `/api/queue/update-docknumber/${queueID}`,
        { dockingNumber: dockingDoorNumber }
      );
      setRefresh(!refresh);
      return response.data;
    } else {
      return "cancel";
    }
  };

  return (
    <Row className="m-5">
      {/* <Col md={2}>
        <AdminLinksComponent />
      </Col> */}
      <Col md={12}>
        <h2 style={{ margin: "auto" }}>
          Truck Queue Status{" "}
          <LinkContainer to="/admin/create-new-queue">
            <Button variant="warning">Add Queue</Button>
          </LinkContainer>
        </h2>

        <p></p>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th>คิว</th>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Doc Type</th>
              <th>Assign Dock</th>
              <th>ประตู</th>
              <th>เรียกคิว</th>
              <th>ครั้งที่</th>
              <th>เวลา</th>
              <th>Check in / Out</th>
            </tr>
          </thead>
          {loading ? (
            <tbody style={{ textAlign: "center" }}>
              {queues.map((queue, idx) => {
                idx++;
                return !queue.isCheckOut ? (
                  <tr key={idx}>
                    <td>{queue.queueNumber}</td>
                    <td>
                      {queue.suppliers.map((supplier, index2) => {
                        index2 = index2 + 200;
                        return (
                          <div key={index2}>
                            {supplier.supplierCode}
                            <br />
                          </div>
                        );
                      })}
                    </td>
                    <td>
                      {queue.suppliers.map((supplier, index3) => {
                        index3 = index3 + 300;
                        return (
                          <div key={index3}>
                            {supplier.supplierName}
                            <br />
                          </div>
                        );
                      })}
                    </td>
                    <td
                      style={{ textAlign: "center", justifyContent: "center" }}
                    >
                      {queue.goodsType}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        className="btn-sm"
                        variant="warning"
                        onClick={() => assignDockingDoor(queue._id)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {queue.dockingDoorNumber
                        ? queue.dockingDoorNumber
                        : "N/A"}
                    </td>

                    {/* <td>
                    {queue.createdAt
                      ? new Date(queue.createdAt).toLocaleString("en-GB", {
                          timeZone: "Asia/Bangkok",
                          hour12: false,
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })
                      : "N/A"}
                  </td> */}

                    <td style={{ textAlign: "center" }}>
                      <Button
                        variant="primary"
                        className="btn-sm"
                        //style={{ width: "30%" }}
                        onClick={() =>
                          sendLineNotification(
                            queue._id,
                            queue.dockingDoorNumber
                          )
                        }
                        disabled={isSending}
                      >
                        {isSending ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <i className="bi bi-send"></i>
                        )}
                      </Button>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {queue.queueCalledCount}
                    </td>

                    <td>
                      {queue.queueCalledTime
                        ? new Date(queue.queueCalledTime).toLocaleString(
                            "en-GB",
                            {
                              timeZone: "Asia/Bangkok",
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          ) + " น."
                        : "N/A"}
                    </td>
                    <td>
                      {queue.isCheckin ? (
                        /* CHECK IN BUTTON */
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => checkOut(queue._id, queue.isCheckin)}
                          disabled={queue.isCheckOut}
                        >
                         <i className="bi bi-door-closed"></i>
                        </Button>
                      ) : (
                        /* CHECK OUT BUTTON */
                        <Button
                          variant="success"
                          className="btn-sm"
                          onClick={() =>
                            closeQueue(queue._id, queue.dockingDoorNumber)
                          }
                          disabled={queue.isCheckin}
                        >
                          <i className="bi bi-check-circle"></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  ""
                );
              })}
            </tbody>
          ) : (
            ""
          )}
        </Table>
        {!loading ? (
          <ColorRing
            visible={true}
            height="7rem"
            width="7rem"
            wrapperStyle={{ marginLeft: "30rem", marginTop: "0rem" }}
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        ) : (
          ""
        )}
      </Col>
    </Row>
  );
};

export default QueuePageComponent;
