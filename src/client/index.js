import { searchLocation } from './js/app'
import { autocomplete, refreshList } from './js/autocomplete'
import { fetchTrips } from './js/app'
import './styles/style.scss'
import './styles/autocomplete.scss'
import './styles/modal.scss'
import './styles/trip.scss'


export {
    searchLocation,
    autocomplete,
    fetchTrips,
    refreshList
}

console.log("Index.js reporting for duty sir!");

//HTML reference variables
const location = document.getElementById("location");

//event listeners

autocomplete(location, searchLocation);
fetchTrips();