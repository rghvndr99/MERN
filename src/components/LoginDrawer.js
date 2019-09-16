import React from 'react';
import userlogo from '../image/user_logo.png';


class LoginDrawer extends React.Component {
	constructor (props) {
    super(props);
    this.loginCtrl = this.loginCtrl.bind(this);
  }  
  loginCtrl = () => {
    this.props.login(this.username.value,this.password.value);
  }

	render() {
		return (
            <div className="login-drawer">
                <div className="img-container">
                    <img src={userlogo} alt="Avatar" className="avatar" />
                </div>

                  <div className="container">
                    <label htmlFor="uname"><b>Username</b></label>
                    <input type="text" ref= {(input) => this.username = input} placeholder="Enter Username" name="uname" required />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" ref= {(input) => this.password = input} placeholder="Enter Password" name="psw" required />

                    <button className="btn btn-login" onClick={this.loginCtrl}>Login</button>                    
                  </div>
            </div>
			)
	}
}

export default LoginDrawer;