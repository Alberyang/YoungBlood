import React from 'react';
import { ChatEngine } from 'react-chat-engine';
import '../../App.css';
import ChatFeed from './ChatFeed';
import LoginForm from './LoginForm';

const Chat = () => {
    if (!localStorage.getItem('username')) return <LoginForm />

    return (
        <ChatEngine
            height="93vh"
            projectID="5a603bc9-1fad-473d-93a7-a7978c6eadb8"
            userName={localStorage.getItem('session').split(",")[5].substring(8).replace(/['"]+/g, '')}
            userSecret={localStorage.getItem('password')}
            renderChatFeed={(chatAppProps) => <ChatFeed {... chatAppProps} />} 
        />
    );
};

export default Chat;