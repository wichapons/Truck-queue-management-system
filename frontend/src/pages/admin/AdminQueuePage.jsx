import QueuePageComponent from "./components/QueuePageComponent";
import axios from "axios";

const getOrders = async() => {
    const response = await axios.get("/api/orders/admin");
    return response.data
}

const AdminQueuePage = () => {
  return <QueuePageComponent getOrders={getOrders} />
};

export default AdminQueuePage;

