/* 
    Variables 
*/
const form = document.getElementById('loginForm');
const emailField = document.getElementById('emailTextField');
const passwordField = document.getElementById('passwordTextField');
let map;
let r;
let country;
let weight;
/*location object containing coordinates of country and count*/
let locations = {
    lati: 0,
    long: 0,
    count: 0
};
/*array that wil contain locations object*/
let heatArr = [];

/* 
    Validates email to be an @murdoch.edu.au domain using regex 
*/
function ValidateMurdochEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@murdoch.edu.au+$/;
    if (emailField.value.match(mailformat)) {
        alert("VALID EMAIL");
        return true;
    }
    alert("INVALID EMAIL");
    emailField.focus();
    return false;
}

/* Listener for form. Calls ValidateMurdochEmail() function and checks for authentcity.
   Need to modify this for authenticating with Firebase. */
/* form.addEventListener('submit', (e) => {
    if (emailField.value === '' || passwordField === '' ||
        emailField.value === null || passwordField === null ||
        ValidateMurdochEmail() === false) {
        e.preventDefault();
    }
}) */

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
*/
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {center: {lat: 1.3421, lng: 103.9198}, 
    zoom: 2, });
}

window.initMap = initMap;

/*
    GeoCode
*/
function geocode(country, weight){
    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: country,
            key: "AIzaSyCjdKyrFDIIxYLcHJ2C5_4QV-bdfF7ZWTE"
        }
    })
    .then(function(resp){
            locations.lati = resp.data.results[0].geometry.location.lat;
            location.long = resp.data.results[0].geometry.location.lng;
            locations.count = weight;
            add(locations);
    })
    .catch(function(err){
        console.log("Error for geocode");
    });
}   

function add(r){
    heatArr.push(r);
    let c = 0;
    console.log(heatArr[c]);
    c = c + 1;

}