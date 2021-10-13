// provide an opaque rectangular backdrop for other components (e.g., SideDrawer)
//
// NOTE: requires the following HTML to be present in index.html so that
// the createPortal call can find the alternate location in the DOM to
// render this content:
//      div id="backdrop-hook"></div>
import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = props => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
