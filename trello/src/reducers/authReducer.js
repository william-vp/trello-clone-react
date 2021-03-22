import {
    LOADING,
    LOGIN_ERROR,
    LOGIN_SUCCESS, LOGOUT,
    REGISTER_ERROR,
    REGISTER_SUCCESS, SET_AUTH_USER, TRUNCATE_REGISTER,
    VERIFY_EMAIL_REGISTER_ERROR,
    VERIFY_EMAIL_REGISTER_SUCCESS, VERIFY_USERNAME_REGISTER_ERROR,
    VERIFY_USERNAME_REGISTER_SUCCESS
} from "../types/authTypes";

const initialState = {
    auth: false,
    email_verification: false,
    username_verification: false,
    register_success: false,
    user: null,
    authLoading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case VERIFY_EMAIL_REGISTER_SUCCESS:
            return {
                ...state,
                email_verification: action.payload
            }
        case VERIFY_EMAIL_REGISTER_ERROR:
            return {
                ...state,
                email_verification: action.payload
            }
        case VERIFY_USERNAME_REGISTER_SUCCESS:
            return {
                ...state,
                username_verification: action.payload
            }
        case VERIFY_USERNAME_REGISTER_ERROR:
            return {
                ...state,
                username_verification: action.payload
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                username_verification: false,
                email_verification: false,
                register_success: true
            }
        case TRUNCATE_REGISTER:
            return {
                ...state,
                username_verification: false,
                email_verification: false,
                register_success: false
            }
        case REGISTER_ERROR:
            return {
                ...state,
                register_success: false
            }

        case SET_AUTH_USER:
            return {
                ...state,
                auth: true,
                user: action.payload,
                authLoading: false
            }
        case LOGIN_SUCCESS:
            const token = action.payload;
            localStorage.setItem('token', token)
            return {
                ...state,
                auth: true,
                token: token
            }
        case LOGIN_ERROR:
            return {
                ...state,
                auth: false,
                token: null,
                user: null
            }
        case LOGOUT:
            localStorage.removeItem("token")
            return {
                ...state,
                auth: false,
                token: null,
                user: null
            }
        case LOADING:
            return {
                ...state,
                authLoading: action.payload
            }
        default:
            return state;
    }
}