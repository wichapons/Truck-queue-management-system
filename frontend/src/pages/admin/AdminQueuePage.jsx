import QueuePageComponent from "./components/QueuePageComponent";
import axios from "axios";

const getQueue = async(producType) => {
    const response = await axios.get(`/api/queue/${producType}`);
    return response.data
}

const AdminQueuePage = () => {
  return <QueuePageComponent getQueue={getQueue} />
};

export default AdminQueuePage;

