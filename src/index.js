import Post from "@models/Post";
import * as $ from 'jquery' //подключаем jquery
import './styles/styles.css' //подключаем стили, чтобы вебпак их нашел и обработал
import json from './assets/json' //подключаем json
import WebpackLogo from '@/assets/webpack-logo' //подключаем картинку
import xml from './assets/data.xml' //подключаем xml файл
import csv from './assets/data.csv'

const post = new Post('Webpack post title', WebpackLogo)

$('pre').addClass('code').html(post.toString())

console.log(json)

console.log('xml', xml)

console.log('scv', csv)