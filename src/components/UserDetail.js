import React from 'react';

class UserDetail extends React.Component {
	constructor (props) {
		super(props)
	}

	render() {
        const { loginDetail,logout,productList, productPortalListing } = this.props;
        const {name, balance, address, cart} = loginDetail[0];
		return (
				<div className="logged-in-user-drawer">
                    <div className="user-info">
                        <span className="info">
                            Name: <span className="legend">{name}</span> 
                        </span>
                        <span className="info">
                            Balance: <span className="legend">{balance}</span> 
                        </span>
                        <span className="info">
                            Address: <span className="legend">{address}</span>
                        </span>
                        <span className="info">
                                Items: <span className="legend">{cart.length}</span>
                        </span>
                        <button className="btn go-to-cart" onClick={() => productList('fromCart')}> Go to Cart</button>
                        <button className="btn go-to-portal" onClick={productPortalListing}> Product Portal</button>
                        <button className="btn logout" onClick={logout}> Logout</button>
                    </div>
                </div>
			)
	}
}

export default UserDetail;