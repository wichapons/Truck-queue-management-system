import RTVQueuePageComponent from "./components/RTVQueuePageComponent";
import axios from "axios";

const getQueue = async() => {
    const response = await axios.get(`/api/queue/rtv`);

    return response.data
}

const AdminRTVQueuePage = () => {
  return <RTVQueuePageComponent getQueue={getQueue} />
};

export default AdminRTVQueuePage;

