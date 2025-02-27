import ChatComponent from "@/components/LiveChatComp"
import { useParams } from "react-router-dom"

const LiveChat = () => {
  const {userId} = useParams()
  return (
    <div >
      <div className="text-3xl ml-32 font-bold">Live Chat</div>
      <ChatComponent receiverId={userId}/>
    </div>
  )
}

export default LiveChat
