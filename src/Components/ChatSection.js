import React, { useRef, useState } from 'react'
import firebase from 'firebase/app';
import {db, auth} from '../firebase';

import { useCollectionData } from 'react-firebase-hooks/firestore';

function ChatSection() {

    const dummy = useRef();
    const messagesRef = db.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');
  
    const sendMessage = async(e) => {
      e.preventDefault();
      const { uid, photoURL } = auth.currentUser;
  
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
  
      setFormValue(''); 
      dummy.current.scrollIntoView({ behavior: 'smooth'});
    }
    return (
        <div className='comment_area'>
            <div className='messeges'>
              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              <span ref={dummy}></span>
            </div>
      
            <form onSubmit={sendMessage} className='form'>
              <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" className='input'/>
              <button type="submit" disabled={!formValue} className='button'>Send</button>
            </form>
        </div>
    )
}

function ChatMessage(props) {
    const { text, uid, photoURL} = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
    return (
      <div className={`message ${messageClass}`}>
        <img alt='' src={photoURL} className='image' />
        <p>{text}</p>
      </div>
    )
}

export default ChatSection
