import React from 'react';
import {useState} from 'react';
import axios from 'axios';

const LoginForm = () => {
    const username = localStorage.getItem('session').split(",")[5].substring(8).replace(/['"]+/g, '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const authObject = {
            'Project-ID': "5a603bc9-1fad-473d-93a7-a7978c6eadb8",
            'User-Name': username,
            'User-Secret': password
        };

        try {
            await axios.get('https://api.chatengine.io/chats', {headers: authObject});
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            window.location.reload();
        } catch(error) {
            setError('Incorrect credentials!');
        }
    }

    return (
        <div className="wrapper">
            <div className="form">
                <h1 className="title">YoungBlood Chat</h1>
                <form onSubmit={handleSubmit}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="password" required />
                    <div align="center">
                        <button type="submit" className="button">
                            <span>Join Chat Channel</span>
                        </button>
                    </div>
                    <h2 className="error">{error}</h2>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;