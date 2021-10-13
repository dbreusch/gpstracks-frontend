// tools for working with HTTP requests

import { useState, useCallback, useRef, useEffect } from 'react';

// wrapper for an HTTP client
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    // manage HTTP requests
    const sendRequest = useCallback(async (
        url,
        method = 'GET',
        body = null,
        headers = {}
    ) => {
        // console.log(`http-hook: ${url} ${method} ${body}`);
        // // show data appended to FormData object
        // for (var pair of body.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        // set the "is loading" flag
        setIsLoading(true);

        // create an AbortController and queue it as an active request
        // to handle failed HTTP requests
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        // try the HTTP request using fetch
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            // convert response to JSON
            const responseData = await response.json();

            // request successful (so far), dequeue AbortController for this request
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            // top-level check for request success
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            // clear "is loading" flag
            setIsLoading(false);

            return responseData;
        } catch (err) {
            setError(err.message || 'Something went wrong, please try again.');
            setIsLoading(false);
            throw (err);
        }
    }, []);

    // clear HTTP errors
    const clearError = () => {
        setError(null);
    };

    // clear any pending AbortControllers on unload
    useEffect(() => {
        return () => {  // cleanup function
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
        clearError
    };
};
