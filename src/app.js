const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDierctoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDierctoryPath))

app.get('', (req, res) =>{
    res.render('index', {
        title: 'Weather',
        name: 'Lidor Dafna'
    })
})

app.get('/about', (req, res) =>{
    res.render('about',{
        title: 'About me',
        name: 'Lidor Dafna'
    })
})

app.get('/help', (req, res) =>{
    res.render('help',{
        title: 'Help Page',
        msg: 'An help message...', 
        name: 'Lidor Dafna'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must proide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {} ) => {
        if (error){
            return res.send({ error })
        } 
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({ error })
            }

            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) =>{
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) =>{
    res.render('404', {
        msg: 'Help article not found.',
        title: '404 Error',
        name: 'Lidor Dafna'
    })
})

app.get('*', (req, res) =>{
    res.render('404', {
        msg: 'Page not found.',
        title: '404 Error',
        name: 'Lidor Dafna'
    })
})

app.listen(port, () =>{
    console.log('Server is up on port ' + port)
})