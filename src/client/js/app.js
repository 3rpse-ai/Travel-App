//import { request } from "express";
import { refreshList } from './autocomplete'


//HTML reference variables
const button = document.getElementById("generate");
const feelingsBox = document.getElementById("feelings");
const zipBox = document.getElementById("zip");
const entryField = document.querySelector(".holder.entry")
const entryDate = document.getElementById("date");
const entryTemp = document.getElementById("temp");
const entryFeel = document.getElementById("content");

//variables for storing location array
let geoNames;
let selectedGeoName;


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

function searchLocation(query){
    postWeatherData('http://localhost:8000/receiveLocations',{location: query, length: 10})
    .then(function(data){
        geoNames = data.geonames;
        console.log(geoNames);
        let names = [];
        for(const geoName of geoNames){
            names.push(geoName.name)
        }
        refreshList(zipBox, names, getSelectedPosition);
    })
};

//callback function for receiving the autoselect element position
function getSelectedPosition(position){
    selectedGeoName = geoNames[position];
    console.log(selectedGeoName);
}

export{ searchLocation }