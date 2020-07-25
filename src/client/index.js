import { searchLocation } from './js/app'
import { autocomplete } from './js/autocomplete'
import './styles/style.scss'
import './styles/autocomplete.scss'
import './styles/modal.scss'


export{
    searchLocation,
    autocomplete
}

console.log("Index.js reporting for duty sir!");

//HTML reference variables
const location = document.getElementById("location");

//event listeners

autocomplete(location, searchLocation);