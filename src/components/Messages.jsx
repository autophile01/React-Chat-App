import React, { useEffect } from 'react'
import Message from "../components/Message"
import { useState } from 'react';
import {db} from "../firebase"
import { doc } from 'firebase/firestore';
import { useContext } from 'react';
import { onSnapshot } from 'firebase/firestore';
import {ChatContext} from "../context/ChatContext"


function Messages() {

  const [messages, setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,'chats',data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages)
    }) 

    return ()=>{
      unSub()
    }
  },[data.chatId])

  return (
    <div className='messages'>
    {messages.map(m=>(
      <Message messages={m} key={m.id}/>
    ))}
    </div>
  )
}

export default Messages
