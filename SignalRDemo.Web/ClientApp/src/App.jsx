import React, {useEffect, useRef} from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const App = () => {

    const connectionRef = useRef(null);

    useEffect(() => {

        const connectToHub = async () => {
            const connection = new HubConnectionBuilder().withUrl("/api/test").build();
            await connection.start();
            connectionRef.current = connection;

            connection.on('newMessage', value => {
                console.log(value);
            });
        }

        connectToHub();

    }, []);

    const onButtonClick = () => {
        connectionRef.current.invoke('foobar');
    }

    return <div className="container mt-5">
        <button className='btn btn-primary' onClick={onButtonClick}>Click me</button>
    </div>
}

export default App;