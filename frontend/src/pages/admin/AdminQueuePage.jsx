import QueuePageComponent from "./components/QueuePageComponent";
import axios from "axios";

const getQueue = async() => {
    const response = await axios.get("/api/queue");
    return response.data
}

const AdminQueuePage = () => {
  return <QueuePageComponent getQueue={getQueue} />
};

export default AdminQueuePage;

