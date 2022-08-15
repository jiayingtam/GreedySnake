// 引入一个包
const path = require('path');

// 引入Webpack HTML 插件
const HTMLWebpackPlugin = require('html-webpack-plugin');

// 引入clean-webpack-plugin 插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 引入

// 使用 webpack 对 ts 文件进行打包编译的相关配置
// webpack中所有配置项都应该写到 module.exports 中
module.exports = {
  mode:"development",
  // 指定入口文件
  entry: './src/index.ts',
  // 指定打包文件所在目录(文件出口)
  output: {
    // 指定打包文件的目录
    path: path.resolve(__dirname, 'dist'),
    // 打包后的JS的文件名
    filename: 'bundle.js',
    // environment: {
    //   // 告知 webpack 打包JS文件时不使用箭头函数
    //   arrowFunction: false,
    // },
  },
  // mode: 'none',
  // 指定 webpack 打包时要使用的模块
  module: {
    // 指定要加载的规则
    rules: [
      // 设置bable
      {
        // test 指定的事规则生效的文件（等待打包的文件，在这里即为.ts格式的文件）
        test: /\.ts$/,
        // 指定需要用的module，这里需要先使用 ts-loader 处理.ts格式的文件， 再使用 babel 解决兼容性（写在后面的包先执行）
        use: [
          // 配置babel（使用配置对象配置）
          {
            // 指定加载器
            loader: 'babel-loader',
            // 配置项
            options: {
              // 设置预定义的环境
              // 需要要兼容的浏览器的版本全部写到targets内
              // targets: ['ie 11', 'chrome 88'],
              targets: ['chrome 88'],
              presets: ['@babel/preset-env'],
              // 旧的配置方式：
              // presets: [
              //   // 指定环境的插件
              //   '@babel/preset-env',
              //   // 环境配置信息
              //   {
              //     // 需要要兼容的浏览器的版本全部写到targets内
              //     targets: {
              //       chrome: '58', //较新的浏览器版本（支持ES6）
              //       ie: '11', //非常老版本的浏览器
              //     },
              //     // 指定corejs的版本
              //     corejs: '3',
              //     // 使用corejs的方式，'usage'表示按需加载
              //     useBuiltIns: 'usage',
              //   },
              // ],
            },
          },
          'ts-loader',
        ],
        // 要排除的文件
        exclude: /node-modules/,
      },

      // 设置less文件的处理
      {
        test: /\.less$/,
        use: [
          // 由下往上处理， 最下面的先执行
          'style-loader',
          'css-loader',
          // 引入postcss并进行相关配置，postcss包的作用：兼容旧版本的浏览器的css
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env',
                  // {
                  //   // 设置兼容的浏览器版本
                  //   browsers: 'last 2 versions',
                  // },
                ],
              },
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  // 配置 webpack 插件
  plugins: [
    // 该插件的作用：在重新打包前，先清空打包输出文件内的旧文件，确保文件夹内没有旧的文件
    new CleanWebpackPlugin(),
    // 该插件的作用：自动生成html文件，直接引用上述打包生成的JS文件（非常好用方便！）
    new HTMLWebpackPlugin({
      // 配置生成的 html 文件的 title
      // title: '这是自动生成的html文件的title',
      // 指定项目内某个html文件作为打包生成的html的模版
      template: './src/index.html',
    }),
  ],
  // 配置引用模块（确认哪些文件可以作为模块被引用）
  resolve: {
    // 告知 webpack .ts .js 结尾的文件可以作为模块被引入
    extensions: ['.ts', '.js'],
  },
};
