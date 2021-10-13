// tools to manage forms

import { useCallback, useReducer } from 'react';

// the reducer function
// handles 'INPUT_CHANGE' and 'SET_DATA'
const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;   // skip undefined values
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };

        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            };

        default:
            return state;
    }
};

// the external function for this hook
// handles/returns form state, input handler and form definition
export const useForm = (initialInputs, initialFormValidity) => {

    // define reducer function
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    // callback to handle form input changes
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        });
    }, []);

    // callback to handle form definition
    const setFormData = useCallback((inputData, formValidity) => {
        // console.log(inputData);
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        });
    }, []);

    return [formState, inputHandler, setFormData];
};
