import { Row, Col, Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import Spinner from "react-bootstrap/Spinner";

const QueueHistoryPageComponent = ({ getQueueHistory }) => {
  const utcDate = new Date().toISOString().split('T')[0]; //get UTC date in yyyy-MM-dd format

  //convert in to GMT+7.00 
  const currentDateInGMT7 = new Date(utcDate);
  currentDateInGMT7.setUTCHours(currentDateInGMT7.getUTCHours() + 7);
  // Format the date as a string in yyyy-MM-dd format
  const formattedDateInGMT7 = currentDateInGMT7.toISOString().split('T')[0];

  const [queues, setQueues] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [startDate, setStartDate] = useState(formattedDateInGMT7); // initial date as Today
  const [endDate, setEndDate] = useState(formattedDateInGMT7); // initial date as Today

  const [startDateForDisplay, setStartDateForDisplay ] = useState(currentDateInGMT7.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }));
  const [endDateForDisplay, setEndDateForDisplay ] = useState(currentDateInGMT7.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }));
  
  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get productType from user info
      const tokenResponse = await axios.get("/api/get-token");

      if (!tokenResponse.data) {
        alert("Cannot get access token");
        return;
      }

      setProductType(tokenResponse.data.productType);
      
      // Fetch data from DB based on product type
      const queues = await getQueueHistory(startDate,endDate);

      setQueues(queues);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        //redirect to login page
        window.location.href = "/login";
      }
    }
  };

  const closeQueue = async (queueID, dockingDoorNumber) => {
    setLoadingStates((prevState) => ({ ...prevState, [queueID]: true }));
    if (!dockingDoorNumber) {
      alert("กรุณาเลือกประตูที่เรียกคิว ก่อนที่จะปิดงานค่ะ");
      return "cancel";
    }
    const response = await axios.put(`/api/queue/close/${queueID}`);
    // Set the specific button to be disabled
    setLoadingStates((prevState) => ({ ...prevState, [queueID]: false }));
    setRefresh(!refresh);

    return response.data;
  };

  const checkOut = async (queueID, isCheckin) => {
    if (!isCheckin) {
      alert("กรุณากด Check in ก่อน Check out ค่ะ");
      return "cancel";
    }

    if (window.confirm("ยืนยันการปิดงาน?")) {
      setLoadingStates((prevState) => ({ ...prevState, [queueID]: true }));
      const response = await axios.put(`/api/queue/checkout/${queueID}`);
      // Set the specific button to be disabled
      setLoadingStates((prevState) => ({ ...prevState, [queueID]: false }));
      setRefresh(!refresh);
      return response.data;
    } else {
      return "cancel";
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setStartDateForDisplay(formattedDate)
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setEndDateForDisplay(formattedDate)
  };

  const handleFilterButtonClick = () => {
    // Perform actions based on the selected start and end dates
    fetchData();
  };

  return (
    <Row className="m-5">
      <Col md={12}>
      <h2 style={{ margin: "auto" }}>
          History{" "}
          {/* Add input start date and end date for filter */}
          
        </h2>
        <p></p>
        <div>
            <label>Start Date:</label>
            {" "}
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
            <label style={{ marginLeft: "1rem" }}>End Date: </label>{" "}
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
            {" "}
            <Button variant="warning btn-sm" onClick={handleFilterButtonClick}>
              Search
            </Button>
          </div>

        <div>
        <p></p>
          {/* <p>
            Auto-refresh in {countdown} seconds{" "}
            <Button onClick={refreshPage} className="btn-sm btn-success">
              <i className="bi bi-arrow-clockwise"></i>
            </Button>
          </p> */}
        </div>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th>วันที่</th>
              <th>คิว</th>
              <th>รหัสผู้ขนส่ง</th>
              <th>ชื่อผู้ขนส่ง</th>
              <th>ประเภทเอกสาร</th>
              <th>เลขประตู</th>
              <th>เวลาส่งไลน์</th>
              <th>Check in</th>
              <th>Check Out</th>
            </tr>
          </thead>
          {
            !loading ? ( queues.length > 0 ? (<tbody style={{ textAlign: "center" }}>
              {queues.map((queue, idx) => {
                idx++;
                return queue.isCheckOut ? (
                  <tr key={idx}>
                    <td>
                      {new Date(queue.createdAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Bangkok",
                        hour12: false,
                        year: "numeric",
                        month: "short" /*AUG*/,
                        day: "2-digit",
                      })}
                    </td>
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
                      style={{ textAlign: "center", justifyContent: "center" }}
                    >
                      {queue.goodsType}
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
                        // CHECK IN TIME
                        queue.checkInTime ? (
                          new Date(queue.checkInTime).toLocaleString("en-GB", {
                            timeZone: "Asia/Bangkok",
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          }) + " น."
                        ) : (
                          "N/A"
                        )
                      ) : (
                        // CHECK IN BUTTON
                        <Button
                          variant="success"
                          className="btn-sm"
                          onClick={() =>
                            closeQueue(queue._id, queue.dockingDoorNumber)
                          }
                          disabled={queue.isCheckin || loadingStates[queue._id]}
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
                      {queue.isCheckOut
                        ? // CHECK OUT TIME
                          queue.checkOutTime
                          ? new Date(queue.checkOutTime).toLocaleString(
                              "en-GB",
                              {
                                timeZone: "Asia/Bangkok",
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )+ " น."
                          : // Render nothing if checkOutTime is not available
                            ""
                        : // CHECK OUT BUTTON
                          queue.isCheckin && (
                            <Button
                              variant="danger"
                              className="btn-sm"
                              onClick={() =>
                                checkOut(queue._id, queue.isCheckin)
                              }
                              disabled={
                                queue.isCheckOut ||
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
                  ""
                );
              })}
            </tbody>):(<tbody style={{ textAlign: "center" }}>
                <tr>
                  <td colSpan="11">ไม่พบข้อมูลคิวในระบบระหว่างวันที่ {startDateForDisplay} ถึง {endDateForDisplay} </td>
                </tr>
              </tbody>)

            
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

export default QueueHistoryPageComponent;
