// manage user login and logout
// saves/manages userid, token and token expiration data (in local storage)
// uses token expiration date to keep user logged in for a certain period (one hour)
// user will be logged out automatically when token expires
import { useState, useCallback, useEffect } from 'react';

// timer for automatic logout
let logoutTimer;

// useAuth: the main function for user authorization
// manages state, login and logout
export const useAuth = () => {
  // create state variables for userId, token & token expiration
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // login the user
  // creates a token expiration time
  // saves userid, token and token expiration to local storage
  const login = useCallback((uid, token, expirationDate) => {
    // console.log('auth-hook.login');

    // save userId and token
    setUserId(uid);
    setToken(token);

    // determine token expiration; assumes one hour from now
    // use expirationDate if provided, otherwise create new value
    const newTokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(newTokenExpirationDate);

    // save userId, token and expiration to local storage
    try {
      localStorage.setItem('userData', JSON.stringify({
        userId: uid,
        token: token,
        expiration: newTokenExpirationDate.toISOString()
      }));
    }
    catch (err) {
      console.log('auth-hook login Error');
      if (err.name === "NS_ERROR_FILE_CORRUPTED") {
        console.log("Sorry, it looks like your browser storage has been corrupted. Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to 'Everything'. This will remove the corrupted browser storage across all sites.");
      } else {
        console.log(err.message);
      }
    }
  }, []);

  // logout the user
  // clears userid, token and token expiration from state variables and local storage
  const logout = useCallback(() => {
    // clear state variables
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);

    // remove data from local storage
    try {
      localStorage.removeItem('userData');
    }
    catch (err) {
      console.log('auth-hook logout Error');
      if (err.name === "NS_ERROR_FILE_CORRUPTED") {
        console.log("Sorry, it looks like your browser storage has been corrupted. Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to 'Everything'. This will remove the corrupted browser storage across all sites.");
      } else {
        console.log(err.message);
      }
    }
  }, []);

  // useEffect(login) to automatically login user if token has not expired
  // this addresses page refresh or coming back to the page having not
  // logged out during last session
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  // useEffect(logout) set time to logout user when token has expired
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { token, login, logout, userId };
};
