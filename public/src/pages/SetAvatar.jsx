import React,{useState,useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';
import {Buffer} from 'buffer';

function SetAvatar() {
    const api = 'https://robohash.org';
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const navigate = useNavigate();
    const [avatars,setAvatars] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [selectedAvatar,setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose:8000,
        pauseOnHover: true,
        draggable:true,
        theme:"dark",
    };
    const setProfilePicture = async () =>{
        if(selectedAvatar === undefined){
            toast.error("Please select an avatar",toastOptions)
        }else{
            const user = await JSON.parse(localStorage.getItem('user'));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image:avatars[selectedAvatar]
            })
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('user',JSON.stringify(user));
                navigate('/');
            }else{
                toast.error("Error setting avatar. Please try again",toastOptions)
            }
        }
    }
 


    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = [];
            for (let i = 0; i < 4; i++) {
                if (i > 0) {
                    await delay(500);
                  }
                  const response = await axios.get(`${api}/${Math.round(Math.random() * 10000)}.png`, {
                    responseType: 'arraybuffer', 
                  });
                  const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                  data.push(base64Image)
            }
            setAvatars(data);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          }
        };
      
        fetchData();
      }, []);


  return (
    <>
    {
        isLoading ? <Container>
            <img src={loader} alt="loader" className="loader" />
        </Container> : (

            <Container>
        <div className="title-container">
            <h1>Pick an avatar</h1>
        </div>
        <div className="avatars">
                {
        avatars.map((avatar, index) => {
            return (
            <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                <img src={`data:image/png;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
            </div>
            );
        })
}
        </div>
        <button className='submit-btn' onClick={setProfilePicture}>Set Image</button>
    </Container>
    )
}
    <ToastContainer />
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;


export default SetAvatar