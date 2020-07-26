import { refreshList } from './autocomplete'

//Weatherbit API Key
const weatherbitKey = "6653081b9e7e4045904f295cee42510c"


//HTML reference variables
const planTripButton = document.getElementById("planTripButton");
const mainContent = document.getElementById("mainContent");
const tripTemplate = document.getElementById("trip");

//modalVariables
const searchBox = document.getElementById("location");
const startDatePicker = document.getElementById("start");
const endDatePicker = document.getElementById("end");
const modalWindow = document.getElementsByClassName("addTripModal")[0];
const confirmButton = document.getElementById("confirmModal");
const cancelButton = document.getElementById("cancelModal");
const hint = document.getElementById("hint");


//variables for storing location array
let geoNames;
let selectedGeoName;

const currentDate = new Date();
startDatePicker.valueAsDate = addDays(currentDate, 1);
endDatePicker.valueAsDate = addDays(currentDate, 2);
//getting today as string value for datepicker min attribute

//helper functions for converting date to string
function convertDateToString(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return yyyy + '-' + mm + '-' + dd;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

//setting min choosable dates for start/enddate
startDatePicker.min = convertDateToString(addDays(currentDate, 1));
startDatePicker.max = convertDateToString(addDays(currentDate, 14));
endDatePicker.min = convertDateToString(addDays(currentDate, 2));
endDatePicker.max = convertDateToString(addDays(currentDate, 15));


//modal window event listeners
cancelButton.addEventListener("click", function () {
    modalWindow.style.display = "none";
});
modalWindow.addEventListener("click", function (e) {
    if (e.target !== this) {
        return
    }
    modalWindow.style.display = "none";
});
planTripButton.addEventListener("click", function () {
    modalWindow.style.display = "block";
});
confirmButton.addEventListener("click", function () {
    if (selectedGeoName == null) {
        hint.style.display = "inline";
    } else {
        submitForm();
        modalWindow.style.display = "none"
    }
})


//trip card helper functions
function showWeatherData(e) {
    console.log(e);
    const weather = e.parentElement.parentElement.parentElement;
    console.log(weather);
    const weatherBox = weather.querySelector("#weatherBox");
    weatherBox.style.display = "block";
}

function hideWeatherData(e) {
    const weather = e.parentElement.parentElement.parentElement;
    console.log(weather);
    const weatherBox = weather.querySelector("#weatherBox");
    weatherBox.style.display = "none";
}

function updateTripCards(trips) {
    removeAllTripCards();
    for (const trip of trips) {
        addTripCard(trip);
    }
}


function removeAllTripCards() {
    let tripCards = document.getElementsByClassName("tripCard");
    while (tripCards[0]) {
        tripCards[0].parentElement.removeChild(tripCards[0]);
    }
}

function addTripCard(trip) {
    let newTrip = tripTemplate.cloneNode(true);
    newTrip.style.display = "grid";
    newTrip.classList.add("tripCard");

    let location = newTrip.querySelector("#tripLocation");
    let deleteButton = newTrip.querySelector("#delTrip");
    let img = newTrip.querySelector("img");
    let startDate = newTrip.querySelector("#startDate");
    let endDate = newTrip.querySelector("#endDate");
    let days = newTrip.querySelector("#days");
    let expandButton = newTrip.querySelector("#expand");
    let shrinkButton = newTrip.querySelector("#shrink");
    let minTemp = newTrip.querySelector("#min");
    let maxTemp = newTrip.querySelector("#max");
    let avgTemp = newTrip.querySelector("#avg");

    location.innerHTML = trip.name;
    deleteButton.setAttribute("tripId", "" + trip.id);

    deleteButton.addEventListener("click", function () {
        fetch('http://localhost:8000/deleteTrip/' + this.getAttribute("tripId"), {
            method: 'DELETE',
        })
            .then(res => console.log(res.text()))
            .then(function (data) {
                fetchTrips();
            })
    })

    if (trip.picURL == null) {
        img.src = "https://cdn.pixabay.com/photo/2016/04/24/13/24/error-1349562_960_720.png";
    } else {
        img.src = trip.picURL;
    }
    startDate.innerHTML = trip.startTime;
    endDate.innerHTML = trip.endTime;
    days.innerHTML = "" + getDaysLeft(trip.startTime);

    expandButton.addEventListener("click", function () {
        showWeatherData(this);
    });

    shrinkButton.addEventListener("click", function () {
        hideWeatherData(this);
    });

    minTemp.innerHTML = trip.minTemp;
    maxTemp.innerHTML = trip.maxTemp;
    avgTemp.innerHTML = trip.avgTemp;

    mainContent.appendChild(newTrip);
}

function getDaysLeft(startTime){
    const today = new Date(convertDateToString(currentDate));
    const startDate = new Date(startTime);
    return (startDate.getTime() - today.getTime())/(1000*60*60*24);
}




//networking

const postWeatherData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

const getAllTrips = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET',
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

function searchLocation(query) {
    postWeatherData('http://localhost:8000/receiveLocations', { location: query, length: 10 })
        .then(function (data) {
            geoNames = data.geonames;
            console.log(geoNames);
            let names = [];
            for (const geoName of geoNames) {
                names.push(geoName.name)
            }
            refreshList(searchBox, names, getSelectedPosition);
        })

};

function fetchTrips() {
    getAllTrips('http://localhost:8000/all')
        .then(function (data) {
            console.log("awoke")
            updateTripCards(data);
        })
}


function submitForm() {
    const body = { name: selectedGeoName.name, lat: selectedGeoName.lat, lng: selectedGeoName.lng, startTime: startDatePicker.value, endTime: endDatePicker.value };
    postWeatherData('http://localhost:8000/newTrip', body)
        .then(function (data) {
            updateTripCards(data);
        });
}

//callback function for receiving the autoselect element position
function getSelectedPosition(position) {
    selectedGeoName = geoNames[position];
}

export { searchLocation, fetchTrips }