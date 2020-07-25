import { refreshList } from './autocomplete'


//HTML reference variables
const searchBox = document.getElementById("location");
const startDatePicker = document.getElementById("start");
const endDatePicker = document.getElementById("end");
const modalWindow = document.getElementsByClassName("addTripModal")[0];
const confirmButton = document.getElementById("confirmModal");
const cancelButton = document.getElementById("cancelModal");
const planTripButton = document.getElementById("planTripButton");


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

function addDays(date, days){
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

//setting min choosable dates for start/enddate
startDatePicker.min = convertDateToString(currentDate);
startDatePicker.max = convertDateToString(addDays(currentDate, 14));
endDatePicker.min = convertDateToString(addDays(currentDate,1));
endDatePicker.max = convertDateToString(addDays(currentDate,15));


//modal window event listeners
cancelButton.addEventListener("click",function(){
    modalWindow.style.display = "none";
});
modalWindow.addEventListener("click",function(e){
    if (e.target !== this){
        return
    }
    modalWindow.style.display = "none";
});
planTripButton.addEventListener("click",function(){
    modalWindow.style.display = "block";
});

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

function getWeatherData(){

}

//callback function for receiving the autoselect element position
function getSelectedPosition(position) {
    selectedGeoName = geoNames[position];
    console.log(selectedGeoName);
}

export { searchLocation }