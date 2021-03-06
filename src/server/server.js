
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
const server = app.listen(port, listening);

function listening() {
    console.log("server running");
    console.log(`running on localhost: ${port}`);
}

// App data
let trips = [];
let newTrip;
let tripId = 0;

// Routes
app.get('/all', function (req, res) {
    console.log("get called with: " + trips);
    console.log(trips);
    res.send(trips);
});

app.post('/send', function (req, res) {
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

app.post('/receiveLocations', function (req, res) {
    let newData = req.body;
    let newRequest = {
        location: newData.location,
        length: newData.length,
    }
    getData(getLocationURL(newRequest.location, newRequest.length))
        .then(function (data) {
            res.send(data);
        })
})

app.post('/newTrip', function (req, res) {
    let newData = req.body;
    newTrip = {
        id: tripId,
        name: newData.name,
        lat: newData.lat,
        lng: newData.lng,
        startTime: newData.startTime,
        endTime: newData.endTime,
        picURL: null,
        minTemp: null,
        maxTemp: null,
        avgTemp: null,
    }
    getData(getWeatherURL())
        .then(function (data) {
            newTrip.maxTemp = roundToTwo(getMax(data.data));
            newTrip.minTemp = roundToTwo(getMin(data.data));
            newTrip.avgTemp = roundToTwo(getAverage(data.data));
            return getData(getPicURL())
        })
        .then(function (data) {
            if (data.total > 0) {
                newTrip.picURL = data.hits[0].webformatURL;
            }
            trips.push(newTrip);
        })
        .then(function (data) {
            res.send(trips);
            console.log(trips);
            tripId++;
        })
})

app.delete('/deleteTrip/:id', function (req, res) {
    console.log("trips# " + trips.length);

    for (let i = 0; i < trips.length; i++) {
        console.log("checked id: " + trips[i].id);
        console.log("checking id: " + req.params.id);
        console.log(trips[i].id == req.params.id);
        if (trips[i].id == req.params.id) {
            trips.splice(i, 1);
        }
    }
    res.send('successfully deleted');
});

const getData = async (url = '') => {
    const res = await fetch(url);

    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
}


//helper functions for generating URLs
function getLocationURL(location, length) {
    return encodeURI('http://api.geonames.org/searchJSON?q=' + location + '&maxRows=' + length + '&username=' + geoNamesUser);
}

function getWeatherURL() {
    return "https://api.weatherbit.io/v2.0/forecast/daily?lat=" + newTrip.lat + "&lon=" + newTrip.lng + "&key=" + weatherbitKey
}

function getPicURL() {
    return "https://pixabay.com/api/?key=" + pixabayKey + "&q=" + encodeURI(newTrip.name) + "&image_type=photo" + "&category=places" + "&orientation=horizontal";
}


//helper functions for returning average min & max temperature
function getAdaptedWeatherArray(weatherData) {
    let startReached = false;
    let endReached = false;
    let newWeatherArray = [];

    for (day of weatherData) {
        if (!startReached) {
            if (day.valid_date == newTrip.startTime) {
                startReached = true;
            }
        }
        if (startReached && !endReached) {
            newWeatherArray.push(day);
        }
        if (!endReached) {
            if (day.valid_date == newTrip.endTime) {
                endReached = true;
            }
        }
    }
    return newWeatherArray;
}

function getAverage(weatherData) {
    const newData = getAdaptedWeatherArray(weatherData);
    let sum = 0;
    let count = 0;
    for (day of newData) {
        count += 1;
        sum += ((day.min_temp + day.max_temp) / 2);
    }
    if (count != 0) {
        return (sum / count);
    } else {
        return 0;
    }
}
function getMax(weatherData) {
    const newData = getAdaptedWeatherArray(weatherData);
    let max = 0;
    for (day of newData) {
        if (max < day.max_temp) {
            max = day.max_temp;
        }
    }
    return max;
}

function getMin(weatherData) {
    const newData = getAdaptedWeatherArray(weatherData);
    let min = 0;
    for (day of newData) {
        if (min == 0) {
            min = day.min_temp;
        } else if (min > day.min_temp) {
            min = day.min_temp;
        }
    }
    return min;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

module.exports = getData;

