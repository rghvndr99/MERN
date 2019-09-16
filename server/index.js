import config from '../config.js';
import actions from '../server/actions';

import express from 'express';
import mongoDB from 'mongodb';
import bodyParser from 'body-parser';

const mongoClient = mongoDB.MongoClient;
const app = express();

let databaseInstance;



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
	databaseInstance = db.db(config.dbName);
});
app.get('/',(req,res,next) => {
	res.send('server is running');
	next();	
})
app.post('/'+config.api.login,(req,res,next)=> {
	const {userid = '', password = ''} = req.body;
	databaseInstance.collection(config.collections.user).find({
		$and: [{userid:userid},{password:password}]})
		.toArray( (err,result) => {
			res.send({
				result
			});
			next();	
	});
});

app.get('/'+config.api.product,(req,res,next)=> {

	databaseInstance.collection(config.collections.product).find({})
	.toArray( (err,result) => {
		res.send({
			result
		});
		next();	
	});
	
});

app.post('/'+config.api.product,(req,res,next)=> {

	const {userid = ''} = req.body;

	databaseInstance.collection(config.collections.user).find({userid:userid})
		.toArray( (err,result) => {
			databaseInstance.collection(config.collections.product).find({ProductId: {$in: result[0].cart }})
			.toArray( (err,result) => {				
				res.send({
					result
				});
				next();	
			});	
	});
	
});

app.put('/'+config.api.product,(req,res,next)=> {
	
	const {userid = ''} = req.body;

		databaseInstance.collection(config.collections.product).find({SuppliedBy: userid})
			.toArray( (err,result) => {
				res.send({
					result
				});
				next();	
			});		
});

app.put('/'+config.api.editUserClt,(req,res,next)=> {
	
	const {userid = '',productId = ''} = req.body;

	databaseInstance.collection(config.collections.user).find({userid:userid})
		.toArray( (err,result) => {
			result = result[0].cart.filter(item => item !== productId );

			// update use Clt
			databaseInstance.collection(config.collections.user).updateOne({userid:userid},{$set:{cart:result}})
			.then((err,result) =>{
				console.log(result);
			});

			//find related content in product Clt
			databaseInstance.collection(config.collections.product).find({ProductId: {$in: result }})
			.toArray( (err,result) => {				
				res.send({
					result
				});
				next();	
			});	
	});	
});

app.post('/'+config.api.editProductClt,(req,res,next)=> {
	
	const {Product = {}} = req.body;
	delete Product._id;
			//find related content in product Clt
			databaseInstance.collection(config.collections.product).updateOne({ProductId:Product.ProductId},
				{$set:Product}
				).then((err,result)=>{
				databaseInstance.collection(config.collections.product).find({SuppliedBy: Product.SuppliedBy})
					.toArray( (err,result) => {				
						res.send({
							result
						});
						next();	
					});	
			});
});

app.put('/'+config.api.editProductClt,(req,res,next)=> {
	
	const {userid = '',productId = ''} = req.body;

	databaseInstance.collection(config.collections.product).remove({ProductId: productId,SuppliedBy:userid},true)
		.then( (err,result) => {
			databaseInstance.collection(config.collections.product).find({SuppliedBy:userid})
			.toArray( (err,result) => {
				res.send({
					result
				});	
				next();	
			})	
	});	
});


app.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});


