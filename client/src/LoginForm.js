import React, { useState } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { handleGoogleLogin } from './helpers/googleLogin.js';
import { useHistory } from "react-router-dom";


const clientId = "788803847730-svb1dp8j89olr8o0rh1g30a7kl8ugbk6.apps.googleusercontent.com";

const LoginForm = ({ handleLogin, login, err, setCurrentUser, setIsLoggedIn, setIsLogging }) => {
    let history = useHistory();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [showloginButton, setShowloginButton] = useState(true);
    const [showlogoutButton, setShowlogoutButton] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        login(username, password)
    }

    const onLoginSuccess = async (res) => {
        let existingUser = await handleGoogleLogin(res)
        console.log(existingUser)
        setCurrentUser(existingUser)
        setIsLoggedIn(true)
        setIsLogging(false)
        history.push("/");
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    const onSignoutSuccess = () => {
        alert("You have been logged out successfully");
        setShowloginButton(true);
        setShowlogoutButton(false);
    };

    return (
        <div className="form-container">
            <div className="overlay-background" onClick={() => handleLogin(false)}></div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login with your account </h2>
                <label>Username <span className="warning">{err}</span><input autoComplete="off" type="text" name="username" value={username} required onChange={(e) => setUsername(e.target.value)}></input></label>
                <label>Password <input autoComplete="off" type="password" name="password" value={password} required onChange={(e) => setPassword(e.target.value)}></input></label>
                <div className="button-group">
                    <button type="button" className="cancel-btn" onClick={() => handleLogin(false)}>Cancel</button>
                    <button type="submit" className="submit-btn" >Login</button>
                </div>
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Login with Google"
                    onSuccess={onLoginSuccess}
                    onFailure={onLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    className='google-login'
                />
                {showlogoutButton && <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={onSignoutSuccess}
                >
                </GoogleLogout>}
            </form>
        </div>
    )
}

export default LoginForm
