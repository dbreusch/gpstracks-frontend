// the "side drawer" component, used to provide information in an
// overlay that comes in on the left (e.g., small screen navigation links).
// uses CSS to do an animated transition in/out.
//
// NOTE: requires the following HTML to be present in index.html so that
// the createPortal call can find the alternate location in the DOM to
// render this content:
//      <div id="drawer-hook"></div>
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer = props => {
    const content = <CSSTransition
        in={props.show}
        timeout={200}
        classNames={"slide-in-left"}
        mountOnEnter
        unmountOnExit
    >
        <aside
            className="side-drawer"
            onClick={props.onClick}
        >
            {props.children}
        </aside>
    </CSSTransition>;

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
