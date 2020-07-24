//import { request } from "express";
import { refreshList } from './autocomplete'

/* Global Variables */
const apiKey = "&APPID=f44cb97f3f4f45c41e014d003b3551e7&units=imperial";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'.'+ d.getMonth()+'.'+ d.getFullYear();

//HTML reference variables
const button = document.getElementById("generate");
const feelingsBox = document.getElementById("feelings");
const zipBox = document.getElementById("zip");
const entryField = document.querySelector(".holder.entry")
const entryDate = document.getElementById("date");
const entryTemp = document.getElementById("temp");
const entryFeel = document.getElementById("content");


//dynamic URL
function getURL(){
    const location = zipBox.value;
    let zipCode = "";
    let countryCode = "";
    try{
        zipCode = location.split(',')[0];
        countryCode = location.split(',')[1];
    } catch(error){
        console.log("error",error);
    }
    return baseURL + zipCode + "," + countryCode + apiKey;
}

//dynamic URL
function getNewURL(){
    const location = zipBox.value;
    return 'http://api.geonames.org/search?q='+location+'&maxRows=1&username=3rpse';
}


//networking
const getWeatherData = async (url = '') =>{
    const res = await fetch(url);
    
    try{
        const data = await res.json();
        console.log(data);
        return data;
    } catch(error){
        console.log("error",error);
    }
}

const postWeatherData = async (url = '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try{
        const newData = await response.json();
        console.log(response);
        console.log(newData);
        return newData;
    }catch(error){
        console.log("error",error);
    }
}

//Main Function
function processWeatherData(){
    getWeatherData(getURL())
    .then(function(data){
        postWeatherData('http://localhost:8000/send',{date: newDate, temp: fahrenheitToCelsius(data.main.temp), res: feelingsBox.value})
    })
    .then(function(data){
        updateUI();
    })
};

function processNewWeatherData(query){
    postWeatherData('http://localhost:8000/receiveLocations',{location: query, length: 10})
    .then(function(data){
        const geoNames = data.geonames;
        console.log(geoNames);
        let names = [];
        for(const geoName of geoNames){
            names.push(geoName.name)
        }
        refreshList(zipBox, names);
    })
};


//Helper Functions
function fahrenheitToCelsius(fahrenheit){
    return ((fahrenheit-32)*5/9);
}


const updateUI = async() =>{
    const req = await fetch('http://localhost:8000/all');
    
    try{
        const data = await req.json();
        console.log(data);
        entryDate.innerHTML = data.date;
        entryTemp.innerHTML = Math.round(data.temp) + "°C";
        entryFeel.innerHTML = data.res;
        entryField.style.visibility = "visible";
    } catch(error){
        console.log("error",error);
    }
}

export{ processWeatherData, processNewWeatherData }