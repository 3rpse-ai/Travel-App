import { searchLocation } from './js/app'
import { autocomplete } from './js/autocomplete'
import './styles/style.scss'
import './styles/autocomplete.scss'


export{
    searchLocation,
    autocomplete
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
button.addEventListener("click",searchLocation);
entryField.addEventListener("click",function(){
    entryField.style.visibility = "hidden";
})

autocomplete(document.getElementById("zip"), searchLocation);