import QueueHistoryPageComponent from "./components/QueueHistoryPageComponent";
import axios from "axios";

const getQueueHistory = async() => {
  try{
    const response = await axios.get(`/api/queue/history`);
    return response.data
  }catch(err){
    console.log(err);
  }
    
}

const AdminQueueHistory = () => {
  return <QueueHistoryPageComponent getQueue={getQueueHistory} />
};

export default AdminQueueHistory;

