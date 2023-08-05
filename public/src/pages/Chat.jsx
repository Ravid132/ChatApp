import React,{useState,useEffect,useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { allUsersRoute,host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";
import Logout from '../components/Logout';
function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts,setContacts] = useState([]);
  const [currentUser,setCurrentUser] = useState(undefined);
  const [currentChat,setCurrentChat] = useState(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const [showChild1, setShowChild1] = useState(true);
  const [buttonText, setButtonText] = useState('Show Chat');


  useEffect( ()=>{
    const fetchData = async () => {
      try {
        setCurrentUser(await JSON.parse(localStorage.getItem("user")));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if(!localStorage.getItem('user')){
      navigate('/login');
    }else{
      fetchData();
      
    }

  },[])    

  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user",currentUser._id);
    }
  }, [currentUser])
  

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if(currentUser){
      if(currentUser.isAvatarImageSet){
        fetchData();
      }else{
        navigate("/setAvatar");
      }
    }

  },[currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
}


const BothChildren = () => (
  <>
     <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} pickContact={toggleBtn}></Contacts>
        {
         currentChat === undefined ? 
        (<Welcome currentUser={currentUser} />)
        :
        (<ChatContainer  currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
        } 
  </>
);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 767);
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

const toggleBtn = () => {
  if(!isMobile) return;
  setShowChild1((prevShowChild1) => !prevShowChild1);
  setButtonText((prevButtonText) =>
    prevButtonText === 'Show Chat' ? 'Show Contacts' : 'Show Chat'
  );
};


  return (
    <Container>
      <Logout />
      <div className="container">
        {/* <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}></Contacts>
        {
         currentChat === undefined ? 
        (<Welcome currentUser={currentUser} />)
        :
        (<ChatContainer  currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
        } */}

  {isMobile ? (
        showChild1 ? (
          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} pickContact={toggleBtn}></Contacts>
        ) : (
          
            currentChat === undefined ? 
           (<Welcome currentUser={currentUser} />)
           :
           (<ChatContainer  currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
            
        )
      ) : (
        <BothChildren />
      )}

  {isMobile && (
        <button className="mobile-button" onClick={toggleBtn}>
          {buttonText}
        </button>
      )}
      </div>
      </Container>
  )
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  .mobile-button {
    display: none;
  }
  @media (max-width: 767px) {
    .container{
      height: 100vh;
      width: 100vw;
      background-color: #00000076;
      display: grid;
      grid-template-columns: 100%;
    }
    .mobile-button {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
    }
  }
`;

export default Chat;