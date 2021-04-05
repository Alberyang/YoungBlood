import { handleActions } from 'redux-actions';

export default handleActions(
    {
        FETCH_USER_STARTED: (state) => ({
            ...state,
            isFetching: true,
            error: null,
        }),
        FETCH_USER_SUCCESS: (state, action) => ({
            ...state,
            isFetching: false,
            user: action.payload.data,
        }),
        FETCH_USER_FAILURE: (state, action) => ({
            ...state,
            isFetching: false,
        }),
        UPDATE_USER_STARTED: (state) => ({
            ...state,
            isUpdating: true,
            error: null,
        }),
        UPDATE_USER_SUCCESS: (state, action) => ({
            ...state,
            isUpdating: false,
            user: action.payload.data,
        }),
        UPDATE_USER_FAILURE: (state, action) => ({
            ...state,
            isUpdating: false,
            error: action.payload.error,
        }),
        AUTH_USER_STARTED: (state) => ({
            ...state,
            isAuthenticating: true,
            error: null,
        }),
        AUTH_USER_SUCCESS: (state, action) => ({
            ...state,
            isAuthenticating: false,
            user: action.payload.data,
        }),
        AUTH_USER_FAILURE: (state, action) => ({
            ...state,
            isAuthenticating: false,
            error: action.payload.error,
        }),
        DELETE_USER_STARTED: (state) => ({
            ...state,
            isAuthenticating: true,
            error: null,
        }),
        DELETE_USER_SUCCESS: (state, action) => ({
            ...state,
            isAuthenticating: false,
            user: null,
        }),
        DELETE_USER_FAILURE: (state, action) => ({
            ...state,
            isAuthenticating: false,
            error: action.payload.error,
        }),
        SIGN_OUT_USER_SUCCESS: (state, action) => ({
            ...state,
            isAuthenticating: false,
            user: null,
        }),
    },
    {
        isFetching: true,
        isAuthenticating: false,
        isUpdating: false,
        user: null,
        error: null,
    }
);
