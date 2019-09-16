const path = require("path");
const devMode = process.env.NODE_ENV !== 'production'
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const htmlplugin=new HtmlWebPackPlugin({
      template:"./src/index.html",
      filename: "index.html"
});

//const cleanHtml=new CleanWebpackPlugin(["dist"]);

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: "styles/[name].css",
  chunkFilename: "[id].css"
})

module.exports={
    entry: "./src/index.js",
    output: {
        //path: path.resolve("public"),
        filename: "js/bundle.js",
        publicPath: "/"
    },
    devtool: "inline-source-map",
	devServer: {
		port: 5055
	},
    module:{
        rules:[
            {
             test:/\.js$/,
             exclude: /node_modules/,
             loader:"babel-loader"
            },

         {
            test: /\.(sa|sc|c)ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
            ],
         },
         {
          test: /\.(png|jp(e*)g|svg)$/,  
          use: [{
              loader: 'url-loader',
              options: { 
                  limit: 8000, // Convert images < 8kb to base64 strings
                  name: 'image/[hash]-[name].[ext]'
              } 
          }]
          } ,
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['url-loader']
          }  

        ]
    },
    plugins:[htmlplugin, miniCssExtractPlugin]
}