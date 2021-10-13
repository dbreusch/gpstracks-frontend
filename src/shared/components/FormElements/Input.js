// support for custom form input fields
import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

// the reducer function
// handles 'CHANGE' and 'TOUCH'
const inputReducer = (state, action) => {
    switch (action.type) {
        // update element values and validate
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };

        // indicate element "was touched"
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };

        default:
            return state;
    }
};

const Input = props => {

    // define reducer function
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isTouched: false,
        isValid: props.initialIsValid || false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    // pass input changes to form-hook
    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    // update element values and validate
    const changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        });
    };

    // mark element as "touched"
    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    // support 'input' and 'textarea' input fields
    const element = props.element === 'input' ? (
        <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
        />
    ) : (
            <textarea
                id={props.id}
                rows={props.rows || 3}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        );

    return <div className={`form-control
    ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}
    `}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>;
};

export default Input;
