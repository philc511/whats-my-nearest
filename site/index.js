var grounds = (function () {
    var json = null;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
      //console.log(this.responseText);
      json = JSON.parse(this.responseText);
    });
    oReq.open("GET", "./grounds.json", false);
    oReq.send();
    return json;
})(); 

function check() {
    var postcode = document.getElementById("postcode").value;
    lookupPostcode(postcode);
};

function getLocation() {
    navigator.geolocation.getCurrentPosition(show_map);
}

function show_map(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude + ": " + longitude);
    // need to refactor checkLatLong so it can be used from here adnd from API call
  }

function checkLatLong() {
    var result = JSON.parse(this.responseText)["result"];
    if (result) {
        var minDist = 99999;
        var minGround;
        grounds.forEach(ground => {
            var dist = distance(result["latitude"], result["longitude"], 
                    ground["Latitude"], ground["Longitude"]);
            if (dist < minDist ) {
                minDist = dist;
                minGround = ground;
            }
        });

        document.getElementById("resultVal").innerHTML = minGround["Name"] + " (home of " + minGround["Team"] + ") is " + minDist.toFixed(1) + " miles away";
    }
    else {
        document.getElementById("resultVal").innerHTML = "Sorry, postcode not found";
    }
    document.getElementById("result").style.display="block";
}

window.onload = function() {
    var btn = document.getElementById("btn");
    btn.onclick = check;

    var geolocbtn = document.getElementById("geolocbtn");
    geolocbtn.onclick = getLocation;

    document.getElementById("result").style.display="none";
}

function lookupPostcode(postcode) {
    var postcodeApi = new XMLHttpRequest();
    postcodeApi.addEventListener("load", checkLatLong);
    // postcodeApi.onreadystatechange = () => {
    //     if(postcodeApi.readyState === XMLHttpRequest.DONE && postcodeApi.status != 200) {
    //         console.log("NOT FOUND!!!!!");
    //     }
    // };
    postcodeApi.open("GET", "https://api.postcodes.io/postcodes/" + postcode);
    postcodeApi.send();
}

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 7918 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3959 mi
  }
