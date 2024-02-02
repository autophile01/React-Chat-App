import React, { useContext } from 'react'
import Add from "../images/Add.png"
import Attach from "../images/Attach.png"
import {AuthContext} from "../context/AuthContext"
import {ChatContext} from "../context/ChatContext"
import { useState } from 'react'
import { Timestamp, arrayUnion, serverTimestamp } from 'firebase/firestore'
import {v4 as uuid} from "uuid"
import {db} from "../firebase"
import { doc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from "../firebase"

function Input() {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [err,setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () =>{

    if(img){
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(err);
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId),{
              messages : arrayUnion({
                id:uuid(),
                text,
                senderId:currentUser.uid,
                date: Timestamp.now(),
                img:downloadURL
            })
            });
          });
        }
      );

    }else{
      await updateDoc(doc(db, "chats", data.chatId),{
        messages : arrayUnion({
          id:uuid(),
          text,
          senderId:currentUser.uid,
          date: Timestamp.now(),
        })
      })
    }

    await updateDoc(doc(db, "userChats", currentUser.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId + ".date"]:serverTimestamp()
      
    })

    await updateDoc(doc(db, "userChats", data.user.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId + ".date"]:serverTimestamp()
      
    })

    setImg(null);
    setText("");
  }

  return (
    <div className='input'>

      <input type='text' placeholder='Type something....' onChange={e=>setText(e.target.value)} value={text}></input>

      <div className='send'>

      
      <img src={Attach} alt=''></img>
     
      <label htmlFor='file'>
      <img src={Add} alt=''></img>
      </label>

      <input type='file' style={{display:"none"}}id='file' onChange={e=>setImg(e.target.files[0])}></input>

      <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input
