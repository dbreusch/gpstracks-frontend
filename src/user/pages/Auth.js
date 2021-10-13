// manage user authentication tasks
// operates in either login or register mode with appropriate forms to
// collect required user data
// works with backend to login/register users
import React, { useState, useContext, useRef } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // const backendUrl = 'http://localhost:3001';
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT || 3001;

  // define default form
  const [formState, inputHandler, setFormData] = useForm({
    name: undefined,
    email: {
      value: 'a@test.com',
      isValid: false
    },
    password: {
      value: '123456',
      isValid: false
    }
  });

  // save user name so that it's not lost when switching modes
  const prevName = useRef('');

  // change form fields based on login/register mode
  const switchModeHandler = () => {
    // console.log('Switching mode');
    if (!isLoginMode) {     // going TO login mode
      // console.log('Going TO login mode');
      prevName.current = formState.inputs.name.value;
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {                // going TO signup mode
      // console.log('Going TO signup mode');
      // console.log(formState.inputs);
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: prevName.current,
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
      // console.log(formState.inputs);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  // manage user login or registration depending on mode
  const authSubmitHandler = async event => {
    event.preventDefault();

    // console.log('authSubmitHandler enter');
    if (isLoginMode) {  // login mode
      try {
        // send email and password to backend login api
        // console.log('Sending POST');
        const responseData = await sendRequest(
          `${backendUrl}:${backendPort}/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          },
        );
        // console.log(`Auth.js token ${responseData.token}`);

        // login the verified user
        // console.log('Calling auth.login');
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log('authSubmitHandler login Error');
        if (err.name === "NS_ERROR_FILE_CORRUPTED") {
          console.log("Sorry, it looks like your browser storage has been corrupted. Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to 'Everything'. This will remove the corrupted browser storage across all sites.");
        } else {
          console.log(err.message);
        }
      }
    } else {            // register mode
      try {
        // // show form inputs
        // console.log('Data from input form:˝');
        // console.log(`email ${formState.inputs.email.value}`);
        // console.log(`name ${formState.inputs.name.value}`);
        // console.log(`password ${formState.inputs.password.value}`);

        // create and add data to a FormData object
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        // // show data appended to FormData object
        // for (var pair of formData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        // send form to the backend registration api
        // console.log(`backendURL = ${backendUrl}, backendPort = ${backendPort}`);
        const responseData = await sendRequest(
          `${backendUrl}:${backendPort}/register`,
          'POST',
          formData
        );

        // console.log('responseData from users-api/register:')
        // console.log(responseData);

        // login the new user
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log('authSubmitHandler: error in user signup');
        if (err.name === "NS_ERROR_FILE_CORRUPTED") {
          console.log("Sorry, it looks like your browser storage has been corrupted. Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to 'Everything'. This will remove the corrupted browser storage across all sites.");
        } else {
          console.log(err.message);
        }
      }
    };
  };

  // define input forms based on login/register mode
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              initialValue={prevName.current}
              validators={[VALIDATOR_REQUIRE]}
              errorText="Please enter a NAME."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image." />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 characters)."
            onInput={inputHandler}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
          >
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button
          inverse
          onClick={switchModeHandler}
        >
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};


export default Auth;
