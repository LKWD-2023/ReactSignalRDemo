import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';


const Chat = () => {

    const [text, setText] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    const connectionRef = useRef(null);

    useEffect(() => {

        const connectToHub = async () => {
            const connection = new HubConnectionBuilder().withUrl("/api/test").build();
            await connection.start();
            connection.invoke('newUser');
            connectionRef.current = connection;

            connection.on('newChatReceived', chatMessage => {
                setAllMessages(messages => [...messages, chatMessage]);
            });

            connection.on('allMessages', all => {
                setAllMessages(all);
            })
        }

        connectToHub();

    }, []);

    const onSendMessageClick = () => {
        connectionRef.current.invoke('newChatMessage', { message: text });
        setText('');
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-md-10'>
                    <input value={text} onChange={e => setText(e.target.value)} type='text' className='form-control form-control-lg' placeholder='Type your message here...' />
                </div>
                <div className='col-md-2'>
                    <button onClick={onSendMessageClick} className='btn btn-primary btn-lg w-100'>Send Message</button>
                </div>
            </div>

            <div className='row'>
                <div className='col-md-8 offset-md-2 mt-3'>
                    <ul className="list-group">
                        {allMessages.map((chatMessage, i) => {
                            return <li key={i} className="list-group-item">{chatMessage.message}</li>
                        })}
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default Chat;