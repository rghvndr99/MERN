import React from 'react';
import Login from "./Login.js";
import Image from "./Image.js";
import logo from '../image/logo.png';


class Header extends React.Component {
	constructor (props) {
		super(props);
	} 

	render() {
		const {login,drawerClick, cartItemList, loginAssupplier, loginDetail,logout,productList,showLoginDrawer,productPortalListing} = this.props;
		return (
				<React.Fragment>
					<header className="header">
						<div className="hedaer-content" onClick={() => productList()}>
							<Image dataSrc={logo} cssClass="logo"></Image>							
						</div>
						{ loginAssupplier &&
								<h2>Portal items</h2>
						}
						{ cartItemList &&
								<h2>Cart items </h2>
						}
						<div className="userDrawer">
							<Login
							 loginClick={drawerClick} 
							 showLoginDrawer={showLoginDrawer}
							  login = {login}
							  loginDetail = {loginDetail}
							  logout = {logout}
							  productList = {productList}
							  productPortalListing = {productPortalListing}
							/>
						</div>
					</header>
						
				</React.Fragment>
			)
	}
}

export default Header;