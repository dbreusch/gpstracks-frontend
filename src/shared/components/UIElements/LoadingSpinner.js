// use CSS to display a "loading spinner" while waiting for async functions to complete
// No idea where the CSS source came from...though undoubtedly linked to Udemy...
import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = props => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default LoadingSpinner;
