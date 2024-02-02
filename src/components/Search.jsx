import React from 'react'
import {collection, getDocs, query, serverTimestamp, where} from "firebase/firestore";
import {db} from "../firebase"
import { doc } from 'firebase/firestore';
import { useState } from 'react';
import {AuthContext} from "../context/AuthContext"
import { setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { updateDoc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { ChatContext } from '../context/ChatContext';

function Search() {
  const[username,setUsername] = useState("");
  const[user,setUser] = useState(null);
  const[err,setErr] = useState(false);
  
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const handleSearch = async () =>{
     const q = query(collection(db,"users"),where('displayName', '==', username));

     try{
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc)=>{
      console.log(doc.data());
       setUser(doc.data());   
     })

    }catch(err){
      console.log(err);
      setErr(true);
    }
  }

  const handleKey = e=>{
    if (e.code === "Enter") {
      handleSearch();
    }
  }

  const handleSelect = async (u) =>{
    //pehle combined id bna lenge
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try{
      //agr chats me dono ka converstaion already exist krta hai, to koi baat nhi (we just have to update it later)
      const res = await getDoc(doc(db,"chats", combinedId));

      //leking agr nhi krta, then we have to create a new conversation using combined id.
      if(!res.exists()){
        await setDoc(doc(db,"chats",combinedId),{messages:[]})

        //aur uske baad hme userChats me bhi dono ke liye update krna pdega
        //user-1 ne user-2 se baat kri
        await updateDoc(doc(db, "userChats", user.uid),{
           [combinedId + ".userInfo"]:{
             uid:currentUser.uid,
             displayName: currentUser.displayName,
             photoURL: currentUser.photoURL
           },
           [combinedId+".date"]: serverTimestamp()
        });

        //user-2 ne user-1 se baat kri
        await updateDoc(doc(db, "userChats", currentUser.uid),{
          [combinedId + ".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
       });

       dispatch({type:"CHANGE_USER", payload:u})
      }
    }catch(err){
      setErr(true);
    } 
    
    //last me remove krdenge searched friend/user ko
    setUser(null);
    setUsername("");
  }

  return (
    <div className='search'>

    <div className='searchForm'>
    <input type='text' placeholder='Find a friend' 
    onChange={e=>setUsername(e.target.value)}  
    onKeyDown={handleKey} 
    value={username}>
    </input>
    </div>

    {err && "User not found"}

    {user && 
    <div className='userChat' onClick={handleSelect}>
    <img src={user.photoURL} alt=''></img>
    <div className='userChatInfo'>
     <span>{user.displayName}</span>
    </div>
    </div>}

    </div>
  )
}

export default Search
