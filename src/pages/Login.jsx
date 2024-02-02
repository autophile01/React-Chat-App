import React from 'react'
import "../style.scss"
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Login() {

  const[err,setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      
      try{
       await signInWithEmailAndPassword(auth, email, password)
       navigate("/")
      }catch(err){
        setErr(true);
      }
  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
      <span className='logo'>Lama Chat</span>
      <span className='title'>Login</span>
      <form onSubmit={handleSubmit}>
       <input type='email' placeholder='Display Email'></input>
       <input type='password' placeholder='Display Password'></input>
       <input style={{display:"none"}} type='file' id='file'></input>
       <button>Sign In</button>
      {err &&  <span>Something went wrong</span>}
      </form>
      <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login
