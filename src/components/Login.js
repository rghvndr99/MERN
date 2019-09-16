import React from 'react';
import LoginDrawer from "./LoginDrawer.js";
import UserDetail from "./UserDetail.js";
import Image from "./Image.js";
import userlogo from '../image/user-small.png';


class Login extends React.Component {
	constructor (props) {
		super(props)
	}

	render() {
        const {showLoginDrawer, loginClick, login, loginDetail,logout, productList,productPortalListing} = this.props;
		return (
				<React.Fragment>
					<div className="login-wrapper" onClick={()=>loginClick()}>
						{ loginDetail && loginDetail.length>0 &&
							<Image dataSrc={userlogo} cssClass="header-user-logo"></Image>

						}
						{ (!loginDetail || loginDetail.length ==0) && 
							<button className="btn login-link" >Login</button>
						}
					</div>					
                    {showLoginDrawer &&  (!loginDetail || loginDetail.length == 0) &&
                        <LoginDrawer login={login} />
                    }
                    {showLoginDrawer && loginDetail && loginDetail.length > 0 &&
						<UserDetail 
						   loginDetail={loginDetail}
						   logout={logout}
						   productList={productList}
						   productPortalListing={productPortalListing}
						 />
                    }                    
				</React.Fragment>
			)
	}
}

export default Login;