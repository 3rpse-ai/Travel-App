
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//fetch for making requests
const fetch = require("node-fetch");

//dotenv for saver storage of environment variables
const dotenv = require('dotenv');
dotenv.config();

//environment variables
const geoNamesUser = process.env.GEONAMES_USERNAME;
const weatherbitKey = process.env.WEATHERBIT_API_KEY;
const pixabayKey = process.env.PIXABAY_API_KEY;

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'))

// Setup Server
const port = 8000;
const server = app.listen(port,listening);

function listening(){
    console.log("server running");
    console.log(`running on localhost: ${port}`);
}

// App data
let trips = [];
let newTrip;

// Routes
app.get('/all', function(req, res){
    console.log("get called with: " + trips);
    console.log(trips);   
    res.send(trips);
});

app.post('/send', function(req, res){
    let newData = req.body;
    let newEntry = {
        date: newData.date,
        temp: newData.temp,
        res: newData.res
    }
    console.log(newEntry);
    
    projectData = newEntry;
    console.log(projectData);
})

app.post('/receiveLocations', function(req, res){
    let newData = req.body;
    let newRequest = {
        location: newData.location,
        length: newData.length,
    }
    getData(getLocationURL(newRequest.location,newRequest.length))
    .then(function(data){
        res.send(data);
    })
})

app.post('/newTrip', function(req, res){
    let newData = req.body;
    newTrip = {
        name: newData.name,
        lat: newData.lat,
        lng: newData.lng,
        startTime: newData.startTime,
        endTime: newData.endTime,
        picURL: null,
    }
    getData(getWeatherURL())
    .then(function(data){
        return getData(getPicURL())
    })
    .then(function(data){
        if(data.total > 0){
            newTrip.picURL = data.hits[0].webformatURL;
        }
        trips.push(newTrip);
    })
    .then(function(data){
        res.send(trips);
    })
})

const getData = async (url = '') =>{
    const res = await fetch(url);
    
    try{
        const data = await res.json();
        return data;
    } catch(error){
        console.log("error",error);
    }
}


//helper functions for generating URLs
function getLocationURL(location, length){
    return encodeURI('http://api.geonames.org/searchJSON?q='+location+'&maxRows='+length+'&username='+geoNamesUser);
}

function getWeatherURL(){
    return "https://api.weatherbit.io/v2.0/forecast/daily?lat="+ newTrip.lat + "&lon=" + newTrip.lng + "&key=" + weatherbitKey
}

function getPicURL(){
    return "https://pixabay.com/api/?key="+ pixabayKey  + "&q=" + encodeURI(newTrip.name) + "&image_type=photo" + "&category=places";
}


