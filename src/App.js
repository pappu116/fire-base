import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import *as firebase from "firebase/app"
import "firebase/auth"
import firebaseConfig from './firebase.Config';

firebase.initializeApp(firebaseConfig)

function App() {
  const [newUser,setNewUser] =useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '', 
    photo: '',
    password: '',
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const gitProvider = new firebase.auth.GithubAuthProvider();
  const handelClick = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email, } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signedInUser)
        console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message)
    })
  }
  // handel sing out
  const handelSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
        setUser(signOutUser)
      })
      .catch(err => {
      
    })
  }
  const handelBlur = (e) => {
    
    console.log(e.target.name, e.target.value)
    let isFieldValid = true;
    if (e.target.name === 'email') {
     isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isFieldValid)
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = passwordHasNumber && isPasswordValid;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handelSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo)
          updateUserName(user.name)
        })
        .catch(error =>{
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false
          setUser(newUserInfo)
});
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo)
          console.log('sign in user info', res.user)
        })
        .catch(error => {
         const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false
          setUser(newUserInfo)
});
    }
    e.preventDefault();
  }
  const updateUserName = name => {
  var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('user nmae updated successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }
  const handelClickFb = () => {
      firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  // Git adding AerA
  const gitHandelClick = () => {
    firebase.auth().signInWithPopup(gitProvider).then(function(result) {
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
  }

  return (
    <div className="App">
      {user.isSignedIn ? <button onClick={handelSignOut}>Sign out</button> : <button onClick={handelClick}>Sign in</button>}
      <br/>
      <button onClick={handelClickFb}>Logged In With Facebook</button>
      <br />
      <button onClick ={gitHandelClick}>Git With Login</button>
      {
        user.isSignedIn && <div>
          <p>Wellcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() =>setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser"> New User Sign Up</label>
       <form onSubmit={handelSubmit}>
       {newUser && <input name="name" type="text" onBlur={handelBlur} placeholder="Your Name" />}
        <br/>
        <input type="text" name="email" onBlur={handelBlur} placeholder="Your Email Address" required/>
        <br />
        <input type="password" name="password" onBlur={handelBlur} id="" placeholder="Your Password" required/>
        <br />
        <input type="submit" value={newUser? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      { user.success && <p style={{ color: 'green' }}>User {newUser? 'Created' : 'Logged In'} Successfully</p>}
    </div>
  );
}

export default App;
