const path = require('path')
//плагины
const HTMLWebpackPlugin = require('html-webpack-plugin') //динамически подключает скрипты js в html
const {CleanWebpackPlugin} = require('clean-webpack-plugin') //Очищает папку dist от старых файлов
const CopyWebpackPlugin = require('copy-webpack-plugin') //Плагин, который позволяет перемещать файлы
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //Плагин для стилей, позволяет выносить стили в отдельные файлы

module.exports = {
    context: path.resolve(__dirname, 'src'), //директория, где вебпак ищет файлы
    mode: 'development', //тип режима
    entry: {  //точка входа
        main: './index.js',
        analytics: './analytics.js'
    },
    output: { //точка выхода
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'], //указываем расширения, которые можно убрать в файлах
        alias: {
            '@models': path.resolve(__dirname, 'src/models'), //алиасы для директорий
            '@': path.resolve(__dirname, 'src')

        }
    },
    optimization: {
        splitChunks: {  //оптимизация, содается отдельный файл вендлра, где лежит код библиотеки ( в данном случае jquery)
            chunks: "all"
        }
    },
    devServer: {   //сервер, на котором будет запускаться проект
        port: 4200
    },
    plugins: [ //Подключаем плагины через новый инстанс класса
        new HTMLWebpackPlugin({
            template: "./index.html" //указываем исходник html
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/favicon.ico'), //откуда копируем
                to: path.resolve(__dirname, 'dist') //куда копируем
            }
        ]),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].js"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/, //подключаем css лоадер
                use: [MiniCssExtractPlugin.loader,'css-loader'] //пропускает справа налево
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
            }
        ]
    }
}