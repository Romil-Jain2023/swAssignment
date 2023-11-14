const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({ mode } = { mode: "development" }) => {
    return {
        mode,
        entry: "./src/index.tsx",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js"
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                {
                    test: /\.jpe?g|png$/,
                    exclude: /node_modules/,
                    use: ["url-loader", "file-loader"]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            }),
        ],
        devServer: {
            static: path.join(__dirname, 'public'),
            compress: true,
            port: 4000,
          },
    }
};