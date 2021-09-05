import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {

  // const USERS = [
  //     {
  //         id: 'u1',
  //         name: 'Alice',
  //         image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.irrwNUlWRwXVio_sQb4SrgHaE8%26pid%3DApi&f=1',
  //         places: 3
  //     },
  //     {
  //         id: 'u2',
  //         name: 'Bob',
  //         image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP._H_Npva12I8zn8wyS9cF0gAAAA%26pid%3DApi&f=1',
  //         places: 6
  //     },
  //     {
  //         id: 'u3',
  //         name: 'Claudia',
  //         image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9oEp0W4x1ZflHU_h_e2nFQHaFj%26pid%3DApi&f=1',
  //         places: 6
  //     }
  // ];

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  // const backendUrl = 'http://localhost:3001';
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const backendPort = process.env.REACT_APP_BACKEND_PORT;

  // convoluted syntax below is because useEffect "does not want" a function that
  // returns a promise (i.e., async functions).  but it's ok to define an "ief"
  // (immediately executed function) that is defined as async, then call it in the
  // useEffect function.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${backendUrl}:${backendPort}`);
        setLoadedUsers(responseData.users);
      } catch (err) {
        // console.log(err.message);
      }
    };
    fetchUsers();
  }, [sendRequest, backendPort, backendUrl]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
