import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import Spinner from "react-bootstrap/Spinner";

const QueuePageComponent = ({ getQueue }) => {
  let countdownTime = 180;
  const [queues, setQueues] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [productType, setProductType] = useState(null);
  const [lineNotiLoadingStates, setLineNotiLoadingStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [countdown, setCountdown] = useState(countdownTime);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //setLoading(true);
        // Get productType from user info
        const tokenResponse = await axios.get("/api/get-token");

        if (!tokenResponse.data) {
          alert("Cannot get access token");
          return;
        }

        //setProductType(tokenResponse.data.productType);
        

        // Fetch data from DB based on product type
        const queues = await getQueue(/*tokenResponse.data.productType*/);

        // Sort by queue number ASC
        // const sortedQueues = [...queues].sort(
        //   (a, b) => a.queueNumber - b.queueNumber
        // );
        setQueues(queues);
        setLoading(false)
      } catch (error) {
        
        if(error.response.status === 401){
          //redirect to login page
          window.location.href = "/login";
        }
      }
    };
    fetchData();
  }, [refresh]);

  const sendLineNotification = async (queueID, dockingDoorNumber) => {
    setLineNotiLoadingStates((prevState) => ({
      ...prevState,
      [queueID]: true,
    }));
    if (!dockingDoorNumber) {
      alert("กรุณากรอกเลขประตูที่เรียกคิว ก่อนที่จะเรียก Vendor เข้าประตูค่ะ");
      setIsSending(false);
      return "cancel";
    }
    const response = await axios.post(`/api/queue/send-message/${queueID}`);
    setLineNotiLoadingStates((prevState) => ({
      ...prevState,
      [queueID]: false,
    }));
    setRefresh(!refresh);
    return response.data;
  };

  const checkIn = async (queueID, dockingDoorNumber) => {
    setLoadingStates((prevState) => ({ ...prevState, [queueID]: true }));
    if (!dockingDoorNumber) {
      alert("กรุณาเลือกประตูที่เรียกคิว ก่อนที่จะปิดงานค่ะ");
      return "cancel";
    }
    const response = await axios.put(`/api/queue/rtv/checkin/${queueID}`);
    // Set the specific button to be disabled
    setRefresh(!refresh);
    setLoadingStates((prevState) => ({ ...prevState, [queueID]: false }));
    

    return response.data;
  };

  const checkOut = async (queueID, isCheckin) => {
    
    if (!isCheckin) {
      alert("กรุณากด Check in ก่อน Check out ค่ะ");
      return "cancel";
    }

    if (window.confirm("ยืนยันการปิดงาน?")) {
      setLoadingStates((prevState) => ({ ...prevState, [queueID]: true }));                                           
      const response = await axios.put(`/api/queue/rtv/checkout/${queueID}`);
      // Set the specific button to be disabled
      setRefresh(!refresh)
      setLoadingStates((prevState) => ({ ...prevState, [queueID]: false }));
     
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Decrease the countdown
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : countdownTime));
    }, 1000);

    // Clear the interval and trigger re-render when countdown reaches 0
    if (countdown === 0) {
      clearInterval(intervalId);
      setCountdown(countdownTime); // Reset countdown
      setLoading(true)
      setRefresh(!refresh);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

   // Function to refresh the page
   const refreshPage = () => {
    setLoading(true)
    setRefresh(!refresh);
    setCountdown(countdownTime); // Reset countdown
  };

  return (
    <Row className="m-5">
      {/* <Col md={2}>
        <AdminLinksComponent />
      </Col> */}
      <Col md={12}>
        <h2 style={{ margin: "auto" }}>
          RTV Queue Status{" "}
          <LinkContainer to="/admin/create-new-queue">
            <Button variant="warning">Add Queue</Button>
          </LinkContainer>
        </h2>
        <div>
      <p>Auto-refresh in {countdown} seconds <Button onClick={refreshPage} className="btn-sm btn-success"><i className="bi bi-arrow-clockwise"></i></Button></p>    
    </div>

        <p></p>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ textAlign: "center" }}>
            <th>คิว</th>
              <th>รหัสผู้ขนส่ง</th>
              <th>ชื่อผู้ขนส่ง</th>
              <th>ประเภทเอกสาร</th>
              <th>กำหนดประตู</th>
              <th>เลขประตู</th>
              <th>ส่งไลน์</th>
              <th>เวลาส่งไลน์</th>
              <th>Check in</th>
              <th>Check Out</th>
            </tr>
          </thead>
          {!loading ? (
            queues.length > 0 ? (
              <tbody style={{ textAlign: "center" }}>
                {queues.map((queue, idx) => {
                  idx++;
                  return !queue.RTVCheckOutTime ? (
                    <tr key={idx}>
                      <td>{queue.queueNumber}</td>
                      <td>
                        {queue.suppliers.map((supplier, index2) => {
                          index2 = index2 + 20000;
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
                          index3 = index3 + 30000;
                          return (
                            <div key={index3}>
                              {supplier.supplierName}
                              <br />
                            </div>
                          );
                        })}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                        }}
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
                          disabled={lineNotiLoadingStates[queue._id]}
                        >
                          {lineNotiLoadingStates[queue._id] ? (
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
                        {queue.RTVCheckinTime ? (
                          // CHECK IN TIME
                          queue.RTVCheckinTime ? (
                            new Date(queue.checkInTime).toLocaleString(
                              "en-GB",
                              {
                                timeZone: "Asia/Bangkok",
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            ) + " น."
                          ) : (
                            "N/A"
                          )
                        ) : (
                          //If not check-in yet use logic below
                          // CHECK IN BUTTON
                          <Button
                            variant="success"
                            className="btn-sm"
                            onClick={() =>
                              checkIn(queue._id, queue.dockingDoorNumber)
                            }
                            //BY PASS NO NEED TO WAIT FOR CHECK OUT AT FIRST STAGE
                            //disabled={queue.isCheckOut}
                            disabled={loadingStates[queue._id]}
                          >
                            {loadingStates[queue._id] ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              "Check In"
                            )}
                            {/* <i className="bi bi-check-circle"></i> */}
                          </Button>
                        )}
                      </td>

                      <td>
                        {queue.RTVCheckOutTime
                          ? // CHECK OUT TIME
                            new Date(queue.RTVCheckOutTime).toLocaleString(
                              "en-GB",
                              {
                                timeZone: "Asia/Bangkok",
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : // CHECK OUT BUTTON
                            queue.RTVCheckinTime && (
                              <Button
                                variant="danger"
                                className="btn-sm"
                                onClick={() =>
                                  checkOut(queue._id, queue.RTVCheckinTime)
                                }
                                disabled={
                                  queue.RTVCheckOutTime ||
                                  !queue.isCheckin ||
                                  loadingStates[queue._id]
                                }
                              >
                                {loadingStates[queue._id] ? (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  "Check Out"
                                )}
                                {/* <i className="bi bi-door-closed"></i> */}
                              </Button>
                            )}
                      </td>
                    </tr>
                  ) : (
                    <tbody style={{ textAlign: "center" }}>
                <tr>
                  <td colSpan="11">No more RTV queue!</td>
                </tr>
              </tbody>
                  );
                })}
              </tbody>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Table>
        {loading ? (
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
