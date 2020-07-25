//import { request } from "express";
import { refreshList } from './autocomplete'


//HTML reference variables
const searchBox = document.getElementById("location");
const startDatePicker = document.getElementById("start");
const endDatePicker = document.getElementById("end");

//variables for storing location array
let geoNames;
let selectedGeoName;

const currentDate = new Date();
const tmrw = new Date(currentDate);
tmrw.setDate(tmrw.getDate() + 1);
//const tmrw = currentDate.setDate(currentDate.getDate() + 1)
startDatePicker.valueAsDate = currentDate;
endDatePicker.valueAsDate = tmrw;
//getting today as string value for datepicker min attribute

//helper function for converting date to string
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

startDatePicker.min = convertDateToString(currentDate);
endDatePicker.min = convertDateToString(tmrw);


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
        console.log(response);
        console.log(newData);
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

//callback function for receiving the autoselect element position
function getSelectedPosition(position) {
    selectedGeoName = geoNames[position];
    console.log(selectedGeoName);
}

export { searchLocation }