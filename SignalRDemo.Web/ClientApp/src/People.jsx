import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';

const People = () => {

    const connectionRef = useRef(null);

    const [person, setPerson] = useState({ firstName: '', lastName: '', age: '' });
    const [people, setPeople] = useState([]);

    useEffect(() => {

        const connectToHub = async () => {
            const connection = new HubConnectionBuilder().withUrl("/api/test").build();
            await connection.start();
            connectionRef.current = connection;

            connection.on('newPerson', p => {
                setPeople(people => [...people, p]);
            });
        }

        connectToHub();

    }, []);

    useEffect(() => {
        const getPeople = async () => {
            const { data } = await axios.get('/api/people/getall');
            setPeople(data);
        }

        getPeople();
    }, []);

    const onChange = e => {
        const copy = { ...person };
        copy[e.target.name] = e.target.value;
        setPerson(copy);
    }

    const onAddClick = async () => {
        await axios.post('/api/people/add', person);
        setPerson({ firstName: '', lastName: '', age: '' });
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-md-3'>
                    <input className='form-control' type='text'
                        placeholder='First Name'
                        value={person.firstName}
                        name='firstName'
                        onChange={onChange} />
                </div>
                <div className='col-md-3'>
                    <input className='form-control' type='text'
                        placeholder='Last Name'
                        value={person.lastName}
                        name='lastName'
                        onChange={onChange} />
                </div>
                <div className='col-md-3'>
                    <input className='form-control' type='text'
                        placeholder='Age'
                        value={person.age}
                        name='age'
                        onChange={onChange} />
                </div>
                <div className='col-md-3'>
                    <button onClick={onAddClick} className='btn btn-primary w-100'>Add Person</button>
                </div>
            </div>

            <div className='row mt-5'>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {people.map(p => <tr key={p.id}>
                            <td>{p.firstName}</td>
                            <td>{p.lastName}</td>
                            <td>{p.age}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default People;