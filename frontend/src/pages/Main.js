import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.png';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import itsamatch from '../assets/itsamatch.png';

import 'react-chatbox-component/dist/style.css';
import {ChatBox} from 'react-chatbox-component';


export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      })
      console.log(response)
      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: match.params.id }
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    })
  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id));
  }

  var data = [
    ["Ella", "https://pics.me.me/selfy-thread-1-63068404.png"], 
    ["Billy", "https://pics.me.me/selfy-thread-1-63068404.png"], 
    ["Sam", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Jack", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Meme Man", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Yee", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Pepe", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Stevy", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Liam", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["Will", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["I Want Die", "https://pics.me.me/selfy-thread-1-63068404.png"],
    ["End Mii", "https://pics.me.me/selfy-thread-1-63068404.png"],
  ]
  var mataches = data.map(name => {
    return (
    <button className="match"><div><p>{name[0]}</p><img src={name[1]}></img></div></button>
    )
  })

  const messages = [
    {
      "text": "Hello there",
      "id": "1",
      "sender": {
        "name": "Ironman",
        "uid": "user1",
        "avatar": "https://data.cometchat.com/assets/images/avatars/ironman.png",
      },
    },
  ]
  

  return (
    <div>
    <div className="side-bar">
    <div className="title">Matches</div>
    {mataches}
    </div>
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" className="img"/>
      </Link>

      { users.length > 0 ? (
        <ul>  
          {users.map(user => (
            <li key={user._id}>
              <img className="profile" src={user.profile.imageurl} alt={user.profile.name} />
              <footer>
                <strong>{user.profile.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">End of the line :(</div>
      ) }

      { matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match" />

          <img className="avatar" src={matchDev.avatar} alt=""/>
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>CLOSE</button>
        </div>
      ) }
    </div>
    <ChatBox className="chat-box"
    messages={messages}
    />
    </div>
  )
}