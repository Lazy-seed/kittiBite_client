// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:8000/?username=lisa');

// function Test() {
//   const [username, setUsername] = useState('');
//   const [recipient, setRecipient] = useState('');
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [registered, setRegistered] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [typingStatus, setTypingStatus] = useState('');

//   useEffect(() => {
//     socket.on('newMessage', ({ sender, message }) => {
//       setMessages((prevMessages) => [...prevMessages, { sender, message }]);
//     });

//     socket.on('userTyping', ({ sender, typing }) => {
//       if (typing) {
//         setTypingStatus(`${sender} is typing...`);
//       } else {
//         setTypingStatus('');
//       }
//     });

//     return () => {
//       socket.off('newMessage');
//       socket.off('userTyping');
//     };
//   }, []);

//   const registerUser = () => {
//     socket.emit('register', username);
//     setRegistered(true);
//   };

//   const sendMessage = () => {
//     socket.emit('newMessage', {  recipient, message });
//     setMessages((prevMessages) => [...prevMessages, { sender: 'Me', message }]);
//     setMessage('');
//   };

//   const handleTyping = (e) => {
//     setMessage(e.target.value);
//     clearTimeout(typingTimeout);
//     typingTimeout = setTimeout(() => {
//     if (!typing) {
//       setTyping(true);
//       socket.emit('userTyping', { recipient, typing: true });
//     }

//     // Set typing to false after 2 seconds of inactivity
//       setTyping(false);
//       socket.emit('userTyping', { recipient, typing: false });
//     }, 3000);
//   };

//   let typingTimeout;

//   return (
//     <div className="App">
//       {!registered ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button onClick={registerUser}>Register</button>
//         </div>
//       ) : (
//         <div>
//           <h4>{username}</h4>
//           {typing && <h4>{typingStatus}typingggg</h4>}
//           <div>
//             <input
//               type="text"
//               placeholder="Recipient"
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Message"
//               value={message}
//               onChange={handleTyping}
//             />
//             <button onClick={sendMessage}>Send</button>
//             <div>{typingStatus}</div>
//             <div>
//               {messages.map((msg, index) => (
//                 <div key={index}>
//                   <strong>{msg.sender}:</strong> {msg.message}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Test;
