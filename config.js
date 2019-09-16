
//const env = process.env;

const nodeEnv =  'local';

const dbName = 'SupplyManagement';
const dbHost = '127.0.0.1';
const dbPort = '27017';
const port = 8080;
const host = 'localhost';//'127.0.0.1';
const salt_rounds = 12;
const api = {
  product : 'product',
  login : 'login',
  editUserClt: 'edituserClt',
  editProductClt: 'editProductClt'
};
const collections = {
  user: 'userClt',
  product: 'productClt'
}

let mongoConnectUri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
let serverConnectURL = `http://${host}:${port}/`;


export default {
  mongodbUri:  mongoConnectUri,
  port,
  host,  
  env: nodeEnv,
  collections,
  salt_rounds,
  api,
  dbName,
  serverConnectURL
};
