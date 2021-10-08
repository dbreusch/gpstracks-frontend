import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

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
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message || 'Something went wrong, please try again.');
            setIsLoading(false);
            throw (err);
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

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
