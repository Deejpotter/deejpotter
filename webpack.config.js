const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')
const fs = require('fs')

const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('postcss-hexrgba'),
  require('autoprefixer')
]

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy images', function() {
      fse.copySync('./app/assets/images', './docs/assets/images')
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: ['css-loader?url=false', {loader: 'postcss-loader', options: {plugins: postCSSPlugins}}]
}

//* One function for each file directory
let pages = fse.readdirSync('./app/views').filter(function(file) {
  return file.endsWith('.ejs')
}).map(function (page) {
    // Split names and extension
    const parts = page.split('.')
    const name = parts[0]
    const extension = parts[1]
  return new HtmlWebpackPlugin({
    title: `Deej Potter | ${name}`,
    filename: `${name}.html`,
    template: `./app/views/${page}`,
    minify: false,
    templateParameters: require(`./app/data/${name}.json`)
  })
})


//! This one wasn't loading properly for some reason
// // Our function that generates our html plugins
// function generateHtmlPlugins (templateDir) {
//   // Read files in template directory
//   const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
//   return templateFiles.map(item => {
//     // Split names and extension
//     const parts = item.split('.')
//     const name = parts[0]
//     const extension = parts[1]
//     // Create new HTMLWebpackPlugin with options
//     return new HtmlWebpackPlugin({
//       filename: `${name}.html`,
//       template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
//     })
//   })
// }
// // Call our function on our views directory.
// const htmlPlugins = generateHtmlPlugins('./app')

let config = {
  entry: './app/assets/scripts/App.js',
  plugins: [
    
  ].concat(pages),
  module: {
    rules: [
      cssConfig,
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
    test: /\.(jpe?g|png|gif|svg)$/i,
    include : path.join(__dirname, 'assets/images'),
    loader  : 'url-loader?limit=30000&name=images/[name].[ext]'
 }, // inline base64 URLs for <=30k images, direct URLs for the rest
    ]
  }
}

if (currentTask == 'dev') {
  cssConfig.use.unshift('style-loader')
  config.output = {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  }
  config.devServer = {
    before: function(app, server) {
      server._watch('./app/views/**/*.ejs')
    },
    contentBase: path.join(__dirname, 'app/views'),
    hot: true,
    port: 3000,
    host: '0.0.0.0'
  }
  config.mode = 'development'
}

if (currentTask == 'build') {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  postCSSPlugins.push(require('cssnano'))
  config.output = {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'docs')
  }
  config.mode = 'production'
  config.optimization = {
    splitChunks: {chunks: 'all'}
  }
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
    new RunAfterCompile()  
  )
}

module.exports = config