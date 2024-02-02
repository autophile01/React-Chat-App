import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { onSnapshot } from "firebase/firestore";
import {ChatContext} from "../context/ChatContext"

//Order of hooks rendering in component
  //State & Ref Hooks --> Effect Hooks --> Context Hooks

function Chats() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  //jb bhi current user ki uid me kuch bhi changes honge(real time fetching), we will update & fetch the latest chats using firebase's onSnapshot
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    //if current user exists, then fetch their chats
    currentUser.uid && getChats();

  }, [currentUser.uid]);

  const handleSelect = (u) =>{
    dispatch({type:"CHANGE_USER", payload:u})
  }
  
  console.log(Object.entries(chats));

  return (
    <div className="chats">

      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map(chat =>

      <div 
      className="userChat" 
      key={chat[0]} 
      onClick={()=>handleSelect(chat[1].userInfo)}
      >

      {chat[1].userInfo && (
      <>
        <img src={chat[1].userInfo.photoURL} alt="" />
        
        <div className="userChatInfo">
          <span>{chat[1].userInfo.displayName}</span>
          <p>{chat[1].lastMessage?.text}</p>
        </div>
        
      </>
    )}

      </div>
      )} 
    </div>
  )
}

export default Chats;
