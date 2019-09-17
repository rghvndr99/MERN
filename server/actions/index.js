import config from '../../config.js';
import { async } from 'q';

const deleteProduct = async(query)=>{
    return await global.databaseInstance.collection(config.collections.product).remove(query,true);
}

const filterProducts = async(query ={})=>{
    return await global.databaseInstance.collection(config.collections.product).find(query);
}

const updateProduct = async(Product)=>{
    return await global.databaseInstance.collection(config.collections.product).updateOne({ProductId:Product.ProductId},{$set:Product});
}
const findAssociatedProduct = async(result)=>{
    return await global.databaseInstance.collection(config.collections.product).find({ProductId: {$in: result }})
}

const updateUser = async(userid,result)=>{
    return await global.databaseInstance.collection(config.collections.user).updateOne({userid:userid},{$set:{cart:result}})
}
const findUserById = async(query)=>{
    return await global.databaseInstance.collection(config.collections.user).find(query);
}
const loginService = async(userid,password)=>{
    return await global.databaseInstance.collection(config.collections.user).find({
		$and: [{userid:userid},{password:password}]});
}

export {
    loginService,
    deleteProduct,
    filterProducts,
    updateProduct,
    findUserById,
    updateUser,
    findAssociatedProduct,
}