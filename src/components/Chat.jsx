import React from 'react'
import Camera from "../images/Camera.png"
import AddFriend from "../images/AddFriend.jpeg"
import More from "../images/More.jpeg"
import Messages from './Messages'
import Input from "../components/Input"
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'

function Chat() {

  const {data} = useContext(ChatContext);

  return (
    <div className='chat'>
      <div className='chatInfo'>
      <span>{data.user?.displayName}</span>
      <div className='chatIcons'>
        <img src={Camera} alt=''></img>
        <img src={AddFriend} alt=''></img>
        <img src={More} alt=''></img>
      </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat
