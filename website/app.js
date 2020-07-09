//import { request } from "express";

/* Global Variables */
const apiKey = "f44cb97f3f4f45c41e014d003b3551e7";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//HTML reference variables
const button = document.getElementById("generate");
const feelingsBox = document.getElementById("feelings");
const zipBox = document.getElementById("zip");
const entryDate = document.getElementById("date");
const entryTemp = document.getElementById("temp");
const entryFeel = document.getElementById("content");
const entryField = document.querySelector(".holder.entry")

//event listeners
button.addEventListener("click",processWeatherData);
entryField.addEventListener("click",function(){
    entryField.style.visibility = "hidden";
})

//dynamic URL
function getURL(postcode){
    return baseURL + postcode + ",at&APPID=" + apiKey;
}

//networking
const getWeatherData = async (url = '') =>{
    const res = await fetch(url);
    
    try{
        const data = await res.json();
        //attention
        entryTemp.innerHTML = fahrenheitToKelvin(data.main.temp);
        entryField.style.visibility = "visible";
        //attention
        console.log(data);
        return data;
    } catch(error){
        console.log("error",error);
        console.log(error.message);
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
        console.log(newData);
    }catch(error){
        console.log("error",error);
    }
}

//Main Function
function processWeatherData(){
    getWeatherData(getURL(zipBox.value))
    .then(function(data){
        postWeatherData('/send',{date: newDate, temp: fahrenheitToKelvin(data.main.temp), res: entryFeel.value})
    })
}




//Helper Function
function fahrenheitToKelvin(kelvin){
    return (kelvin-273.15);
}