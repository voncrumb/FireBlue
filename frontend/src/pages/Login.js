import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ history }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if(username != null && password != null){
      const response = await api.post('/devs', {
        username,
        password
      });
  
      const { _id } = response.data;
  
      history.push(`/dev/${_id}`);
    }

    
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img className="logo" src={logo} alt="Tindev" />
        <input 
          placeholder="LinkedIn Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          placeholder="LinkedIn Password"
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}