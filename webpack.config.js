const path = require('path')
//плагины
const HTMLWebpackPlugin = require('html-webpack-plugin') //динамически подключает скрипты js в html
const {CleanWebpackPlugin} = require('clean-webpack-plugin') //Очищает папку dist от старых файлов
const CopyWebpackPlugin = require('copy-webpack-plugin') //Плагин, который позволяет перемещать файлы
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //Плагин для стилей, позволяет выносить стили в отдельные файлы
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') //Плагин для css
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer') //Анализ подключенных бандлов

const isDev = process.env.NODE_ENV === 'development' //получаем доступ к окружению
const isProd = !isDev

console.log(isDev, 'isDev')

const optimization = () => {

    const config = {
        splitChunks: {  //оптимизация, содается отдельный файл вендорра, где лежит код библиотеки ( в данном случае jquery)
            chunks: "all"
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}` //Убирем хеш из имени файлов во время разработки

const cssLoaders = extra => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true
        },
    }, 'css-loader']
    if (extra) {
        loaders.push(extra)
    }
    return loaders
}

const babelOptions = preset => {
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: ['@babel/plugin-proposal-class-properties']
    }
    if (preset) {
        options.presets.push(preset)
    }
    return options
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push('eslint-loader') //Подключаем eslint
    }

    return loaders
}

const plugins = () => {
    const base = [ //Подключаем плагины через новый инстанс класса
        new HTMLWebpackPlugin({
            template: "./index.html", //указываем исходник html
            minify: {
                collapseWhitespace: isProd //оптимизация html, если production
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/favicon.ico'), //откуда копируем
                to: path.resolve(__dirname, 'dist') //куда копируем
            }
        ]),
        new MiniCssExtractPlugin({
            filename: filename('css') //плагин css
        })
    ]
    if(isProd) {
        base.push(new BundleAnalyzerPlugin()) //подключаем анализ бандла в проде
    }
    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'), //директория, где вебпак ищет файлы
    mode: 'development', //тип режима
    entry: {  //точка входа
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: { //точка выхода
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'], //указываем расширения, которые можно убрать в файлах
        alias: {
            '@models': path.resolve(__dirname, 'src/models'), //алиасы для директорий
            '@': path.resolve(__dirname, 'src')

        }
    },
    optimization: optimization(),
    devServer: {   //сервер, на котором будет запускаться проект
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '', //Возможность посмотреть исходный код в браузере
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/, //подключаем css лоадер
                use: cssLoaders() //пропускает справа налево
            },
            {
                test: /\.less$/, //подключаем less лоадер
                use: cssLoaders('less-loader') //пропускает справа налево
            },
            {
                test: /\.s[ac]ss$/, //подключаем sass лоадер
                use: cssLoaders('sass-loader') //пропускает справа налево
            },
            {
                test: /\.(png|jpeg|gif)$/, //подключаем лоадер для работы с файлами(в данном случае изображения)
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/, //лоадер для шрифтов
                use: ['file-loader']
            },
            {
                test: /\.xml$/, //обработка xml файлов
                use: ['xml-loader']
            },
            {
                test: /\.csv$/, //обработка csv файлов
                use: ['csv-loader']
            },
            {
                test: /\.js$/, // подключаем babel
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/, // подключаем Type Script
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/, // подключаем React
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}