//var markers = new Array();
var mid = 0;
var nextpoint = 0;
var nextlatlng = '';
var newpoint = '';
var showmarkers = true;

var outdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=af071baf070341ad86b5100adeec252b', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

var hikebike = L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var mylat= '53.073635';
var mylong = '8.806422';


var map = L.map('map', {
    center: [53.073635, 8.806422],
    zoom: 13,
    layers: [outdoors],
    zoomControl: true
});

var baseLayers = {
    "outdoors": outdoors,
    "satellite": satellite,
    "hikebike": hikebike,
    "OpenStreetMap_France":OpenStreetMap_France
};


var polyline = L.polyline([]).addTo(map);
L.control.layers(baseLayers).addTo(map);
var markerGroup = L.layerGroup().addTo(map);

function editgpxFromDrop(file){
    //TODO Read GPX file into string that can be used by editgpx()
   } 

function editgpx(){
var parser, xmlDoc;
gpxString= document.getElementById("gpxtrack").value;
parser = new DOMParser();
xmlDoc = parser.parseFromString(gpxString,"text/xml");
 txt = "";
    x = xmlDoc.getElementsByTagName('trkpt');
     var inc = Math.ceil(x.length/200);
    console.log('no of markers' + x.length +"  inc = "+inc);
   
    for (i = 0; i < x.length; i=i+ inc) { 
        lat= x[i].getAttribute('lat');
        lon= x[i].getAttribute('lon');
        var latlng = L.latLng(lat, lon);
        var newMarker = new L.marker(latlng, {
        draggable: 'true',
		}).addTo(markerGroup);

		console.log(newMarker._leaflet_id);
		newMarker
			.on('dragstart', dragStartHandler)
			.on('click', dragStartHandler)
			.on('drag', dragHandler)
			.on('dragend', dragEndHandler);
		polyline.addLatLng(latlng);
		
		

		}
    map.setView((latlng));
    displaylatlong();
    map.fitBounds(polyline.getBounds());
	redrawmarkers();
   } 

// function onMapClick(e) {
//     var newMarker = new L.marker(e.latlng, {
//         draggable: 'true',
//     }).addTo(markerGroup);

//     console.log(newMarker._leaflet_id);
//     newMarker
//         .on('dragstart', dragStartHandler)
//         .on('click', dragStartHandler)
//         .on('drag', dragHandler)
//         .on('dragend', dragEndHandler);
//     polyline.addLatLng(L.latLng(e.latlng));
//     map.setView((e.latlng));
//     displaylatlong();

// }

// map.on('contextmenu', onMapClick);

function dragStartHandler(e) {
    // Get the polyline's latlngs
    var latlngs = polyline.getLatLngs(),
    // Get the marker's start latlng
    latlng = this.getLatLng();
    console.log('thislatlng= ' + latlng)
    // Iterate the polyline's latlngs
    for (var i = 0; i < latlngs.length; i++) {
        // Compare each to the marker's latlng
        if (latlng.equals(latlngs[i])) {
            // If equals store key in marker instance
            this.polylineLatlng = i;
            nextpoint = i - 1;
            if (nextpoint < 0) {
                nextpoint = 0;
            }
            nextlatlng = latlngs[nextpoint];
            console.log('nextlatlng= ' + nextlatlng);
            bounds = L.latLngBounds(latlng, nextlatlng);
            newpoint = bounds.getCenter();
            console.log('centre= ' + newpoint);

        }
    }
}

function dragHandler(e) {
    // Get the polyline's latlngs
    var latlngs = polyline.getLatLngs(),
    // Get the marker's current latlng
    latlng = this.getLatLng();
    markerid = this._leaflet_id;
    // Replace the old latlng with the new
    latlngs.splice(this.polylineLatlng, 1, latlng);
    // Update the polyline with the new latlngs
    polyline.setLatLngs(latlngs);
    if (this.polylineLatlng > -1) {
        this.bindPopup("<button onclick=\"deletepoint(\'" + this.polylineLatlng + "\',\'" + markerid + "\')\">Delete point" + this.polylineLatlng + " " + markerid + "</button><button onclick=\"insertpoint(\'" + this.polylineLatlng + "\',\'" + markerid + "\')\">Insert point" + this.polylineLatlng + " " + markerid + "</button> ").openPopup();
    }
}

function dragEndHandler(e) {
    // Delete key from marker instance
    delete this.polylineLatlng;
    displaylatlong();
}



function deletepoint(mypoint, myid) {
    console.log('in deletepoint' + mypoint + '  ' + myid)
    markerGroup.removeLayer(myid);
    var latlngs = polyline.getLatLngs();
    latlngs.splice(mypoint, 1);
    polyline.setLatLngs(latlngs);
    displaylatlong();
    map.closePopup();
    redrawmarkers();

}

function insertpoint(mypoint, myid) {
    console.log('in insertpoint' + mypoint + '  ' + myid)
        //markerGroup.removeLayer(myid);
    var latlngs = polyline.getLatLngs();
    latlngs.splice(mypoint, 0, newpoint);
    var newMarker = new L.marker(newpoint, {
        draggable: 'true'
    }).addTo(markerGroup);
    console.log(newMarker._leaflet_id);
    newMarker
        .on('dragstart', dragStartHandler)
        .on('click', dragStartHandler)
        .on('drag', dragHandler)
        .on('dragend', dragEndHandler);
    polyline.setLatLngs(latlngs);
    displaylatlong();
    map.closePopup();
}

function togglemarkers() {
	if (showmarkers == true ){ showmarkers = false;}
	else { showmarkers = true;}
	redrawmarkers();
}

function redrawmarkers() {
	var trackc = document.getElementById('trackc').value
    markerGroup.clearLayers();
    polyline.setStyle({
    color: trackc
	});

    // Get the polyline's latlngs
    var latlngs = polyline.getLatLngs();
	if (showmarkers == true ){
    // Iterate the polyline's latlngs
		for (var i = 0; i < latlngs.length; i++) {

			var newMarker = new L.marker(latlngs[i], {
				draggable: 'true'
				}).addTo(markerGroup);

			console.log(newMarker._leaflet_id + showmarkers);
			newMarker
				.on('dragstart', dragStartHandler)
				.on('click', dragStartHandler)
				.on('drag', dragHandler)
				.on('dragend', dragEndHandler);
		}
    }
}

function displaylatlong() {
        var div = document.getElementById('track');
        var trackd = document.getElementById('trackdistance');
        var timestamp = new Date().toLocaleString('en-GB');

        gpxtrack = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<gpx xmlns="http://www.topografix.com/GPX/1/1"  creator="peter-thomson.com" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n<trk><name>' + timestamp + '</name>\n<trkseg>\n';
        div.innerHTML = gpxtrack;
        var latlngs = polyline.getLatLngs();
        trkdistance = 0;
        var lastpoint = latlngs[0];
        // Iterate the polyline's latlngs
        for (var i = 0; i < latlngs.length; i++) {
            trkdistance += latlngs[i].distanceTo(lastpoint);
            var lastpoint = latlngs[i];
            div.innerHTML += '<trkpt lat="' + latlngs[i].lat + '" lon="' + latlngs[i].lng + '"></trkpt>\n';
            gpxtrack += '<trkpt lat="' + latlngs[i].lat + '" lon="' + latlngs[i].lng + '"></trkpt>\n';
        }
        trkdistance = trkdistance / 1000;
        miles = trkdistance * 0.6213712;
        div.innerHTML += '</trkseg>\n</trk>\n</gpx>\n ';
        gpxtrack += '</trkseg>\n</trk>\n</gpx>\n ';
        //trkdistance = trkdistance/1000;
        miles = trkdistance * 0.6213712;
        trackd.innerHTML = 'distance = ' + trkdistance.toFixed(3).toString() + 'km  distance = ' + miles.toFixed(3).toString() + ' miles (note distance is horizontal)';
    }
    
    
    //https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
var download = function (content, fileName, mimeType) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
}


