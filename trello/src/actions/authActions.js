import {
    LOADING,
    LOGIN_ERROR,
    LOGIN_SUCCESS, LOGOUT,
    REGISTER_ERROR,
    REGISTER_SUCCESS, SET_AUTH_USER, TRUNCATE_REGISTER,
    VERIFY_EMAIL_REGISTER_SUCCESS,
    VERIFY_USERNAME_REGISTER_ERROR,
    VERIFY_USERNAME_REGISTER_SUCCESS
} from "../types/authTypes";
import axios from "../config/axios";
import tokenAuth from "../config/tokenAuth";
import {openNotification} from "../components/utils";
import {manage_response} from "../components/utils/manage_response";

//REGISTER
export function verifyEmailRegisterAction(email) {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/auth/verify_email', {email});
            dispatch(verifyEmailRegisterSuccess());
        } catch (e) {
            dispatch(verifyEmailRegisterError(true));
            openNotification("Error", e.response.data.msg, "error")
        }
    }
}

const verifyEmailRegisterSuccess = () => ({
    type: VERIFY_EMAIL_REGISTER_SUCCESS,
    payload: true
});
const verifyEmailRegisterError = () => ({
    type: VERIFY_EMAIL_REGISTER_SUCCESS,
    payload: false
});

export function verifyUsernameRegisterAction(username) {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/auth/verify_username', {username});
            dispatch(verifyUsernameRegisterSuccess());
        } catch (e) {
            dispatch(verifyUsernameRegisterError());
        }
    }
}

const verifyUsernameRegisterSuccess = () => ({
    type: VERIFY_USERNAME_REGISTER_SUCCESS,
    payload: true
});
const verifyUsernameRegisterError = () => ({
    type: VERIFY_USERNAME_REGISTER_ERROR,
    payload: false
});

export function submitRegisterAction(user) {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/users', user);
            console.log(response)
            dispatch(registerSuccess());
            openNotification("Correcto", response.data.msg, "success")
        } catch (e) {
            console.log(e)
            dispatch(registerError());
            openNotification("Error", e.response.data.msg, "error")
        }
    }
}

const registerSuccess = () => ({
    type: REGISTER_SUCCESS,
    payload: true
});
const registerError = () => ({
    type: REGISTER_ERROR,
    payload: false
});

export function truncateRegisterAction() {
    truncateRegister()
}

const truncateRegister = () => ({
    type: TRUNCATE_REGISTER
});

//LOGIN
export function submitLoginAction(user) {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/auth', user);
            if (["user_not_exists", "user_not_exists", "token_error", "password_incorrect", ""].includes(response.data.details)) {
                dispatch(loginError());
                openNotification("Error", response.data.msg, "error")
            }
            if (response.data.details === "success") {
                dispatch(loginSuccess(response.data.token));
                openNotification("Correcto", "Inicio de sesión exitoso", "success")
            }
        } catch (e) {
            dispatch(loginError());
            openNotification("Error", e.response.data.msg, "error")
        }
    }
}

const loginSuccess = token => ({
    type: LOGIN_SUCCESS,
    payload: token
});
const loginError = () => ({
    type: LOGIN_ERROR,
    payload: false
});

export function getAuthUserAction() {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                dispatch(loading(true))
                tokenAuth(token);
                const response = await axios.get('/api/auth');
                if (manage_response(response, false, 'user')) {
                    dispatch(setAuthUser(response.data.user))
                } else {
                    dispatch(loading(false))
                }
            }
        } catch (e) {
            dispatch(loading(false))
        }
    }
}

const setAuthUser = user => ({
    type: SET_AUTH_USER,
    payload: user
});

export function logoutAction() {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                tokenAuth(token);
                const response = await axios.get('/api/auth');
                if (response.data.user) {
                    dispatch(logout())
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}

const logout = () => ({
    type: LOGOUT
});

const loading = state => ({
    type: LOADING,
    payload: state
});

export function updateUserAction(user) {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        try {
            dispatch(loading(true))
            tokenAuth(token);
            const response = await axios.put('/api/users/', user);
            if (user.newEmail) {
                if (response.data.user) {
                    dispatch(setAuthUser(response.data.user))
                    openNotification("Correcto", "Correo electrónico actualizado exitosamente", "success")
                }
            } else if (user.newPassword) {
                if (response.data.user) {
                    dispatch(setAuthUser(response.data.user))
                    openNotification("Correcto", "Contraseña actualizada exitosamente", "success")
                }
            } else {
                if (response.data.user) {
                    dispatch(setAuthUser(response.data.user))
                    openNotification("Correcto", "Información actualizada exitosamente", "success")
                }
            }

        } catch (e) {
            if (e.response) {
                openNotification("Error", e.response.data.msg, "error")
            } else {
                openNotification("Error", "Ocurrió un error inesperado. Intenta nuevamente más tarde", "error")
            }

        }
    }
}