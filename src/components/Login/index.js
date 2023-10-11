import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import "./index.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    loginUser: false,
    showSubmitError: false,
    errorMsg: "",
    success_message:"",
  };

  onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
   this.setState({loginUser:true})
};

  handleForgot = () => {
    this.setState({ redirectToForgot: true });
  };

  handleRegisterClick = () => {
    this.setState({ redirectToRegister: true });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async(e) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      const response = await fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.onSubmitSuccess(data.jwt_token);
      } else {
          const data = await response.json();
          this.setState({errorMsg:data.error_msg})
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    const {
      loginUser,
      showSubmitError,
      errorMsg,
    } = this.state;
    
    if (loginUser) {
      // Redirect to the desired page after successful login
      return <Navigate to="/home"/>;
    }

    return (
      <div className="login-body">
        <div className="login-box" id="sectionBox">
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div className="logo-container">
              <img
                src="https://payinstacard.com/static/media/payinstacardLogo.c9407bb898824c0d1174ce7ad45d2ab3.svg"
                alt="logo"
              />
            </div>
            <h2 className="login-caption">Please Login to Continue</h2>
            <div className="login-user-container">
              <input
                type="text"
                className="login-input"
                placeholder="Email"
                name="email"
                onChange={this.handleChange}
              />
              
            </div>
            <div className="login-user-container">
              <input
                type="password"
                className="login-input"
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
              />
              
            </div>
            {showSubmitError && <p className="error-msg">{errorMsg}</p>}
            <input
              type="submit"
              className="login-button"
              value="Login"
              id="loginbutton"
            />
            <Link to="/forgotpassword"><p className="forgot-password" onClick={this.handleForgot}>Forgot Password?</p></Link>
            <p className="dont-have-account">
              Do have an account?{" "}
              <Link to="/signup">
                <span
                  className="register-here"
                  onClick={this.handleRegisterClick}
                >
                  Register Here
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
