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

function checkLatLong() {
    var result = JSON.parse(this.responseText)["result"];

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

    document.getElementById("resultVal").innerHTML = minGround["Name"];
    document.getElementById("result").style.display="block";
}

window.onload = function() {
    var btn = document.getElementById("btn");
    btn.onclick = check;

    document.getElementById("result").style.display="none";
}

function lookupPostcode(postcode) {
    var postcodeApi = new XMLHttpRequest();
    postcodeApi.addEventListener("load", checkLatLong);
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
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
