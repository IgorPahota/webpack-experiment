import Post from "@models/Post";
import * as $ from 'jquery' //подключаем jquery
import './styles/styles.css' //подключаем стили, чтобы вебпак их нашел и обработал
import './styles/less.less'
import './styles/scss.scss'
import WebpackLogo from '@/assets/webpack-logo' //подключаем картинку
import './babel'
import React from 'react'
import {render} from 'react-dom'

const post = new Post('Webpack post title', WebpackLogo)
$('pre').addClass('code').html(post.toString())

const App = () => (
    <div className="container">
        <h1>Webpack Course</h1>
        <hr/>
        <div className="logo"></div>
        <hr/>
        <pre></pre>
        <div className="box">
            <h2>Less</h2>
        </div>
        <div className="card">
            <h2>Sass</h2>
        </div>
    </div>
)

render(
    <App/>
    , document.getElementById('app'))