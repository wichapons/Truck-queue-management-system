import QueueHistoryPageComponent from "./components/QueueHistoryPageComponent";
import axios from "axios";

const getQueueHistory = async (startDate = null, endDate = null) => {
  try {
    const response = await axios.get(`/api/queue/history`, {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const AdminQueueHistory = () => {
  return <QueueHistoryPageComponent getQueueHistory={getQueueHistory} />;
};

export default AdminQueueHistory;
