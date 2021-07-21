const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: {
		app: './src/index.js'
	},
	devtool: 'inline-source-map',
	// Where files should be sent once they are bundled
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'js/[name].[chunkhash].bundle.js'
	},
	// webpack 5 comes with devServer which loads in development mode
	devServer: {
		port: 3000,
		watchContentBase: true,
		historyApiFallback: true
	},
	// Rules of how webpack will take our files, complie & bundle them for the browser
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /nodeModules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(scss|sass|css)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'images'
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'fonts'
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html'
			// favicon: './favicon.png',
		}),
		new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [
				'css/*.*',
				'js/*.*',
				'fonts/*.*',
				'images/*.*'
			]
		}),
		new CompressionPlugin({
			test: /\.js(\?.*)?$/i
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'node_vendors',
					test: (m) => {
						return (
							m.context &&
							m.context.indexOf('node_modules') !== -1 &&
							m.context.indexOf('material-ui') === -1
						);
					},
					//test: /[\\/]node_modules[\\/]/,
					chunks: 'all'
				},
				material: {
					name: 'node_material',
					test: (mod) => {
						return (
							mod.context &&
							mod.context.indexOf('node_modules') !== -1 &&
							mod.context.indexOf('material-ui') !== -1
						);
					},
					chunks: 'all'
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		}
	},
	performance: {
		hints: 'warning',
		// Calculates sizes of gziped bundles.
		assetFilter: function (assetFilename) {
			return assetFilename.endsWith('.js.gz');
		}
	}
};
