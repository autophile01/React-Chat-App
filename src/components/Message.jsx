import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useRef, useEffect } from 'react';

function Message({messages}) {
  console.log(messages);
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  //To scroll messages we will use useRef Hook & UseEffect Hook
  const ref = useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behaviour:"smooth"})
  },[messages])

  if (!messages || !messages.senderId) {
    return null; // Or you can render an alternative content or handle it as needed
  }

  return (
    <div ref={ref} 
    className={`message ${messages.senderId === currentUser.uid && "owner"}`}>
      <div className='messageInfo'>
        <img src={messages.senderId === currentUser.uid? currentUser.photoURL : data.user.photoURL} alt=''></img>
        <span>just now</span>
      </div>
      <div className='messageContent'>
      <p>{messages.text}</p>
      { messages.img && <img src={messages.img} alt=''></img>}
      </div>
    </div>
  )
}

export default Message
