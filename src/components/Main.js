import React, { Component } from "react";
import Header from "./Header.js";
import Tile from "./Tile.js";
import {productlistingService,
  updateProductservice,
  productPortalListingService,
  removeFromListService,
  loginService
} from '../services';
import EditProductTile from "./EditProductTile.js";
import {
	PopupboxManager,
	PopupboxContainer
  } from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css";



let userInfo = sessionStorage.getItem('userInfo');
userInfo = userInfo ? JSON.parse(userInfo) : [];

class Main extends Component {
    constructor(props){ 
        super(props);
        this.state = {
          productList : [],
          loginDetail : userInfo,
          showLoginDrawer: false,
          loginAssupplier: false,
          cartItemList: false
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.productListing = this.productListing.bind(this);
        this.drawerClick = this.drawerClick.bind(this);
        this.productPortalListing = this.productPortalListing.bind(this);
        this.removeFromlcist = this.removeFromlist.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
    }

componentDidMount() {
      this.productListing();
 }

 removeFromlist = async(productId) => {
    const {loginAssupplier} = this.state;
    const res = await removeFromListService(loginAssupplier,productId);
      this.setState({
        productList:res.result,
        showLoginDrawer: false,
        loginAssupplier: loginAssupplier,
      }); 
 } 
 updateProduct = async(updatedProduct={}) => {
    PopupboxManager.close()
    const res=await updateProductservice(updatedProduct);
          this.setState({
            productList:res.result,
            showLoginDrawer: false,
            loginAssupplier: true
          });          
 }

 editProduct = (product) => {
    PopupboxManager.open({ content: <EditProductTile updateProduct={this.updateProduct} product={product} />});
 }
 productListing = async( from ) => {
        const res = await productlistingService(from);
          this.setState({
            productList:res.result,
            showLoginDrawer: false,
            loginAssupplier: false,
            cartItemList: from && from == 'fromCart' ? true : false
          });
 }

 productPortalListing = async() => {

const res= await productPortalListingService();
          this.setState({
            productList:res.result,
            showLoginDrawer: false,
            loginAssupplier: true,
            cartItemList: false
          });

 }

 login = async( username ='', password ='' ) => {    
    const res = await loginService(username,password);
        this.setState({loginDetail:res.result});
        sessionStorage.setItem('userInfo',JSON.stringify(res.result));
}

logout = () => {
  this.setState({loginDetail: []});
  sessionStorage.setItem('userInfo',JSON.stringify([]));
  this.productListing();
}

drawerClick = () => {
  this.setState({
      showLoginDrawer: !this.state.showLoginDrawer
  })
}


  render() {
    let { productList = [], loginDetail, showLoginDrawer, loginAssupplier, cartItemList } = this.state;

    let tileMarkup = productList.map((item, index) => {
        return <Tile 
            product={item}
            key={index} 
            loginAssupplier={loginAssupplier}
            loginDetail={loginDetail}
            removeFromlist={this.removeFromlist}
            cartItemList={cartItemList}
            editProduct={this.editProduct}            
          />
    });

       return (
        <div>
          <PopupboxContainer />
          <Header 
            login={this.login} 
            logout={this.logout}
            loginDetail={loginDetail}
            productList={this.productListing}
            drawerClick={this.drawerClick}
            showLoginDrawer={showLoginDrawer}
            productPortalListing={this.productPortalListing}
            loginAssupplier={loginAssupplier}
            cartItemList={cartItemList}
           />
          <div className="tile-container">
            {tileMarkup}            
          </div>
        </div>
    );
}
}


export default Main;