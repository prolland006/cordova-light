const REFRESH_LOCATION_TIMER = 2000; //get geolocations every .. milliseconds

var app = {
    trackerInterval: null,
    cordovaReady: false,
    latitude: '',
    longitude: '',
    mapVu: mapView,
    fileManager: new FileManager(),

    // Application Constructor
    initialize: function() {
        console.log('initialize'+this.fileManager);
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("online", this.onLineEvent.bind(this), false);
    },

    onLineEvent: function() {
        if ((this.mapVu.map == null) && (this.latitude != '')) { //same location but we init the map
            this.mapVu.initMap({latitude : this.latitude, longitude: this.longitude}, '#FF0000');
        }
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        console.log('device ready');
        this.receivedEvent('deviceready');
        this.cordovaReady = true;

        this.startTracking();
    },

    startTracking: function() {
        console.log('start tracking....');
        var _this = this;
        self.trackerInterval = setInterval(function() {
            _this.eventRefreshLocations();
        }, REFRESH_LOCATION_TIMER);
    },

    eventRefreshLocations: function() {
        console.log('refresh location');
        navigator.geolocation.getCurrentPosition(this.onSuccess.bind(this), this.onError.bind(this));
    },

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    onSuccess: function(position) {
        /*alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');*/
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        if ((this.latitude ==  position.coords.latitude) && (this.longitude ==  position.coords.longitude)) {
            if (this.isOnline() && (this.mapVu.map == null)) { //same location but we init the map
                this.mapVu.initMap(location, '#FF0000');
            }
            return;
        }

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        if(this.isOnline()) {
            this.mapVu.initMap({latitude: this.latitude, longitude: this.longitude}, '#FF0000');
            this.fileManager.write_file('.','log.txt','post geoloc '+ this.latitude+','+this.longitude,Log('post geoloc wrote log.txt sucessful!'+this.latitude+','+this.longitude));

            this.postGeoloc({latitude: this.latitude, longitude: this.longitude});

        } else {
            console.log('off line');
        }
    },

    postGeoloc: function(geoloc) {
         console.log('post request '+geoloc.latitude+','+geoloc.longitude);
         var xhr = new XMLHttpRequest();
         xhr.open("POST", "https://log-webservice.herokuapp.com/log/add", true);
         xhr.setRequestHeader("Content-Type", "application/json");
         xhr.onreadystatechange = function () {
             if (xhr.readyState != 4 || xhr.status != 201) {
                 console.log("XHR Error: " + xhr.responseText);
                 return;
             }
             console.log("XHR Success: " + xhr.responseText);
        };
        xhr.send(JSON.stringify(geoloc));
    },

    // onError Callback receives a PositionError object
    //
    onError: function(error) {
        console.log(error.message);
    },


    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    isOnline: function() {
        if (this.cordovaReady && navigator.connection.type) {
            return navigator.connection.type !== Connection.NONE;
        } else {
            return navigator.onLine;
        }
    }
};

app.initialize();