import { refreshList } from './autocomplete'

//Weatherbit API Key
const weatherbitKey = "6653081b9e7e4045904f295cee42510c"


//HTML reference variables
const planTripButton = document.getElementById("planTripButton");

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
startDatePicker.valueAsDate = currentDate;
endDatePicker.valueAsDate = addDays(currentDate, 1);
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
startDatePicker.min = convertDateToString(currentDate);
startDatePicker.max = convertDateToString(addDays(currentDate, 14));
endDatePicker.min = convertDateToString(addDays(currentDate, 1));
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
    } else{
        submitForm();
        modalWindow.style.display = "none"
    }
})




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

const getWeatherData = async (url = '') => {
    const res = await fetch(url);

    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

function getWeatherURL() {
    return "https://api.weatherbit.io/v2.0/forecast/daily?lat=" + selectedGeoName.lat + "&lon=" + selectedGeoName.lng + "&key=" + weatherbitKey
}

//callback function for receiving the autoselect element position
function getSelectedPosition(position) {
    selectedGeoName = geoNames[position];
}

function submitForm() {
    const body = { name: selectedGeoName.name, lat: selectedGeoName.lat, lng: selectedGeoName.lng, startTime: startDatePicker.value, endTime: endDatePicker.value };
    postWeatherData('http://localhost:8000/newTrip', body)
        .then(function (data) {
            console.log(data);
        });
}

export { searchLocation }