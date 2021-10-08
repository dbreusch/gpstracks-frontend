import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

const UserItem = props => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT || 3001;

  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={`${backendUrl}:${backendPort}/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            {/* <h3>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3> */}
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
