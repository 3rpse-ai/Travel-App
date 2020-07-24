import { processWeatherData } from './js/app'
import { processNewWeatherData } from './js/app'
import './styles/style.scss'


export{
    processWeatherData,
    processNewWeatherData
}

console.log("Index.js reporting for duty sir!");

//HTML reference variables
const button = document.getElementById("generate");
const feelingsBox = document.getElementById("feelings");
const zipBox = document.getElementById("zip");
const entryField = document.querySelector(".holder.entry")
const entryDate = document.getElementById("date");
const entryTemp = document.getElementById("temp");
const entryFeel = document.getElementById("content");

//event listeners
button.addEventListener("click",processNewWeatherData);
entryField.addEventListener("click",function(){
    entryField.style.visibility = "hidden";
})