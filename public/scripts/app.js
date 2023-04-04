// Description: This file contains all the firebase scripts used in the website.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw1ySW4GfUqEeRtpBTYgCGeMSLC3ru4QU",
    authDomain: "muworldv1-ft6.firebaseapp.com",
    databaseURL: "https://muworldv1-ft6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "muworldv1-ft6",
    storageBucket: "muworldv1-ft6.appspot.com",
    messagingSenderId: "659133217389",
    appId: "1:659133217389:web:386e36e80f023670421d64",
    measurementId: "G-BQJCVKPBJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 
    Variables 
*/
let map;
let addr;

/*location object containing coordinates of country and count*/
let locations = {
    lati: 0,
    long: 0,
};

/*array that wil contain locations object*/
let heatArr = [];

/* 
    Mobile menu functions 
*/
function openMenu(){
    document.body.classList += " menu--open";
    console.log("success");
}

function closeMenu(){
    document.body.classList.remove('menu--open');
}

/*
    Google Maps API
    *initiate google maps
*/
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {center: {lat: 1.3421, lng: 103.9198}, zoom: 2 });
}

window.initMap = initMap;

/*
    GeoCode
    *converts country name into latitude and longitude
    *takes in address
*/
function geocode(addr){
    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: addr,
            key: "AIzaSyCjdKyrFDIIxYLcHJ2C5_4QV-bdfF7ZWTE"
        }
    })
    .then(function(resp){
            locations.lati = resp.data.results[0].geometry.location.lat;
            locations.long = resp.data.results[0].geometry.location.lng;
            heatArr.push(locations);
            heatmap(heatArr);
    })
    .catch(function(err){
        console.log("Error for geocode");
    });
}   

/*
    HEATMAP
    *applies a heatmap layer over the map
*/
function heatmap(l){
    const heatmapData = l.map(({ lati, long }) => ({ location: new google.maps.LatLng(lati, long) }));
    const heatmap = new google.maps.visualization.HeatmapLayer({ data: heatmapData });
    heatmap.setMap(map);
}

// fetches all countries from firebase and calls geocode function
function fetchCountriesAndCallGeocode(){
    const countryRef = collection(db, 'verifiedInteractions');
    const querySnapshot = getDocs(countryRef);
    querySnapshot.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            geocode(doc.data().orgAddress);
        });
    });
}

// Calls the function to fetch countries and call geocode
fetchCountriesAndCallGeocode();