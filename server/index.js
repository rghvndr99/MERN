import config from '../config.js';
import {loginService,
	deleteProduct,
	filterProducts,
	findUserById,
	updateProduct,
	updateUser,
	findAssociatedProduct,
} from './actions';

import express from 'express';
import mongoDB from 'mongodb';
import bodyParser from 'body-parser';
import { async } from 'q';

const mongoClient = mongoDB.MongoClient;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.append('Access-Control-Allow-Headers', '*');
  res.append('Access-Control-Allow-Credentials', 'true');
  next();
});

mongoClient.connect(config.mongodbUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	} , (err,db)=> {

	if (err ) {
		return err;
	}	
	global.databaseInstance = db.db(config.dbName)
});
app.get('/',(req,res,next) => {
	res.send('server is running');
	next();	
})
app.post('/'+config.api.login,async (req,res,next)=> {

	const {userid = '', password = ''} = req.body;
	const response = await loginService(userid,password);
	
	response.toArray( (err,result) => {
			if(err) {
				res.send({
					err
				});
				return;
			}
			res.send({
				result
			});
			next();	
	});
});

app.get('/'+config.api.product,async(req,res,next)=> {

	const response = await filterProducts();

	response.toArray( (err,result) => {
		if(err) {
			res.send({
				err
			});
			return;
		}
		res.send({
			result
		});
		next();	
	});
	
});

app.post('/'+config.api.product,async(req,res,next)=> {

	const {userid = ''} = req.body;


	const userdata= await findUserById({userid:userid});
	userdata.toArray( async(err,result) => {			
			const relatedproduct = await findAssociatedProduct(result[0].cart);
			relatedproduct.toArray( (err,result) => {	
				if(err) {
					res.send({
						err
					});
					return;
				}			
				res.send({
					result
				});
				next();	
			});	
	});
	
});

app.put('/'+config.api.product,async(req,res,next)=> {
	
	const {userid = ''} = req.body;

	const productList = await filterProducts({SuppliedBy: userid});
		productList.toArray( (err,result) => {
			if(err) {
				res.send({
					err
				});
				return;
			}
				res.send({
					result
				});
				next();	
			});		
});

app.put('/'+config.api.editUserClt,async(req,res,next)=> {
	
	const {userid = '',productId = ''} = req.body;
	const userData = await findUserById({'userid':userid});
	
	userData.toArray( async(err,result) => {
			result = result[0].cart.filter(item => item !== productId );
			// update use Clt
			await updateUser(userid,result);
			
			//find related content in product Clt
			const relatedproductInfo = await findAssociatedProduct(result);
			
			relatedproductInfo.toArray( (err,result) => {
				if(err) {
					res.send({
						err
					});
					return;
				}
				res.send({
					result
				});
				next();	
			});	
	});	
});

app.post('/'+config.api.editProductClt,async(req,res,next)=> {
	
	const {Product = {}} = req.body;
	delete Product._id;
			//find related content in product Clt
			await updateProduct(Product);
			const filterBySupplierRes= await filterProducts({SuppliedBy:Product.SuppliedBy});				
				filterBySupplierRes.toArray( (err,result) => {	
					if(err) {
						res.send({
							err
						});
						return;
					}			
						res.send({
							result
						});
						next();	
				});	
});

app.put('/'+config.api.editProductClt,async(req,res,next)=> {
	
	const {userid = '',productId = ''} = req.body;
	const element = {ProductId: productId,SuppliedBy:userid};

	await deleteProduct(element);
	
	const filterBySupplierRes= await filterProducts({SuppliedBy:userid});
	filterBySupplierRes.toArray( (err,result) => {
		if(err) {
			res.send({
				err
			});
			return;
		}
		res.send({
			result
		});	
		next();	
	});
});


app.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});


