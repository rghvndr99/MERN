import React, { Component } from "react";
import Header from "./Header.js";
import Tile from "./Tile.js";
import config from '../../config';
import EditProductTile from "./EditProductTile.js";
import {
	PopupboxManager,
	PopupboxContainer
  } from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"


let userInfo = sessionStorage.getItem('userInfo');
userInfo = userInfo ? JSON.parse(userInfo) : [];

class Main extends Component {
    constructor(props){ 
        super(props);
        this.state = {
          productList : [],
          loginDetail : userInfo || [],
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

 removeFromlist = (productId) => {
    const {loginAssupplier, loginDetail= []} = this.state;
    const userid= loginDetail.length>0 && loginDetail[0].userid || '';
    const url = loginAssupplier ? config.api.editProductClt : config.api.editUserClt;
    const opt= {
      'productId': productId,
      'userid': userid
    }

    fetch(config.serverConnectURL+url,{
      method: 'put',
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body:  JSON.stringify(opt)        
    })
    .then((res) => res.json())
    .then((res) => {
      this.setState({
        productList:res.result,
        showLoginDrawer: false,
        loginAssupplier: loginAssupplier,
      });
    });
 
 } 
 updateProduct = (updatedProduct={}) => {
  PopupboxManager.close()

        fetch(config.serverConnectURL+config.api.editProductClt,{
          method: 'post',
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify({'Product':updatedProduct})      
        })
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            productList:res.result,
            showLoginDrawer: false,
            loginAssupplier: true
          });          
        });
 }

 editProduct = (product) => {
   this.setState({
        isProductEdit: true
   });
    PopupboxManager.open({ content: <EditProductTile updateProduct={this.updateProduct} product={product} />});
 }
 productListing = ( from ) => {
        const { loginDetail } = this.state;
        const userid= from && loginDetail.length>0 && loginDetail[0].userid || '';
        const reqType= userid && userid != '' ? 'post': 'get';   

        fetch(config.serverConnectURL+config.api.product,{
          method: reqType,
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: userid !=''? JSON.stringify({'userid':userid}) : undefined         
        })
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            productList:res.result,
            showLoginDrawer: false,
            loginAssupplier: false,
            cartItemList: from && from == 'fromCart' ? true : false
          });
        });
 }

 productPortalListing = () => {
        const { loginDetail } = this.state;
        const userid= loginDetail.length>0 && loginDetail[0].userid || '';

        fetch(config.serverConnectURL+config.api.product,{
          method: 'put',
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: userid !=''? JSON.stringify({'userid':userid}) : undefined         
        })
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            productList:res.result,
            showLoginDrawer: false,
            loginAssupplier: true,
            cartItemList: false
          });
        });
 }

 login = ( username ='', password ='' ) => {
      let opts={
        'userid': username,
        'password': password
      }
      
      fetch(config.serverConnectURL+config.api.login, {
        method: 'post',
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(opts)
        
      })
      .then((res) => res.json())
      .then((res) => {
        this.setState({loginDetail:res.result});
        sessionStorage.setItem('userInfo',JSON.stringify(res.result));
      });
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
    let { productList = [], loginDetail, showLoginDrawer, loginAssupplier, cartItemList, isProductEdit= false } = this.state;

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
           />
          <div className="tile-container">
            {tileMarkup}            
          </div>
        </div>
    );
}
}


export default Main;