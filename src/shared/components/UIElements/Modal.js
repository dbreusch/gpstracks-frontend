// display components in a modal way, i.e., as a UI element that blocks
// interaction with the rest of the application.  includes an opaque
// Backdrop for visual definition.
//
// modal is formatted as a header and a form; the latter holds the content
// and a footer.
//
// NOTE: requires the following HTML to be present in index.html so that
// the createPortal call can find the alternate location in the DOM to
// render this content:
//      div id="modal-hook"></div>
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

// this component is only used internally, so not exported
const ModalOverlay = props => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form
                onSubmit={ props.onSubmit ? props.onSubmit : event => event.preventDefault() }
            >
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

// main component
const Modal = props => {
    return <React.Fragment>
        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition
            in={props.show}
            mountOnEnter
            unmountOnExit
            timeout={200}
            classNames="modal"
        >
        <ModalOverlay {...props} />
        </CSSTransition>
    </React.Fragment>;
};

export default Modal;
