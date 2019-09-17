import config from '../../config';

let userInfo = sessionStorage.getItem('userInfo');
userInfo = userInfo ? JSON.parse(userInfo) : [];
const userid= userInfo.length>0 && userInfo[0].userid || '';
const headers={ "Content-Type": "application/json; charset=UTF-8" };

const productlistingService = async(from)=>{
    const reqType= from && userid && userid != '' ? 'post': 'get';   

    return await fetch(config.serverConnectURL+config.api.product,{
      method: reqType,
      headers,
      body: from && userid !=''? JSON.stringify({'userid':userid}) : undefined         
    }).then((res) => res.json());
}

const updateProductservice = async(updatedProduct)=> {
    return await fetch(config.serverConnectURL+config.api.editProductClt,{
        method: 'post',
        headers,
        body: JSON.stringify({'Product':updatedProduct})      
      }).then((res) => res.json())
}

const productPortalListingService= async()=> {
    return await fetch(config.serverConnectURL+config.api.product,{
        method: 'put',
        headers,
        body: userid !=''? JSON.stringify({'userid':userid}) : undefined         
      }).then((res) => res.json());
}

const removeFromListService= async(loginAssupplier,productId)=> {
    const url = loginAssupplier ? config.api.editProductClt : config.api.editUserClt;
    const opt= {
      'productId': productId,
      'userid': userid
    };

    return await fetch(config.serverConnectURL+url,{
      method: 'put',
      headers,
      body:  JSON.stringify(opt)        
    }).then((res) => res.json())
}

const loginService = async(username,password)=> {
    let opts={
        'userid': username,
        'password': password
      };
    return await fetch(config.serverConnectURL+config.api.login, {
        method: 'post',
        headers,
        body: JSON.stringify(opts)
        
      }).then((res) => res.json());
}

export {
    productlistingService,
    updateProductservice,
    productPortalListingService,
    removeFromListService,
    loginService
}