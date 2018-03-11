/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const REFRESH_LOCATION_TIMER = 2000; //get geolocations every .. milliseconds

var app = new Vue ({
    el: '#app',
    data: {
        trackerInterval: null,
        cordovaReady: false,
        map: null,
        latitude: '',
        longitude: '',
        waitDisplay: '',
        markerList: []
    },
    methods: {
        // Application Constructor
        initialize: function() {
            console.log('initialize');
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
            document.addEventListener("online", this.onLineEvent, false);
        },

        onLineEvent: function() {
            if ((this.map == null) && (this.latitude != '')) { //same location but we init the map
                this.initMap({latitude : this.latitude, longitude: this.longitude}, '#FF0000');
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
            navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
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
                if (this.isOnline() && (this.map == null)) { //same location but we init the map
                    this.initMap(location, '#FF0000');
                }
                return;
            }

            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;

            if(this.isOnline()) {
                this.initMap({latitude: this.latitude, longitude: this.longitude}, '#FF0000');
            }
        },

        // onError Callback receives a PositionError object
        //
        onError: function(error) {
            /*alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');*/
            console.log(error.message);
            this.coord = error.message;
        },


        // Update DOM on a Received Event
        receivedEvent: function(id) {
           /* var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');*/

            console.log('Received Event: ' + id);
        },

        isOnline: function() {
            if (this.cordovaReady && navigator.connection.type) {
                return navigator.connection.type !== Connection.NONE;
            } else {
                return navigator.onLine;
            }
        },

        initMap: function(location, color) {
            if (google == null) {
                console.log('initMap google null');
                return;
            }
            var latLng = new google.maps.LatLng(location.latitude, location.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            if (this.map == null) {
                this.waitDisplay = 'none';
                this.map = new google.maps.Map(this.$refs.map, mapOptions);
            }
            this.addMarker(location, color);
            this.map.setCenter(latLng);
        },


        pushMarker: function(marker) {
            var removedMarker = this.markerList.shift();
            if (removedMarker != undefined) {
                removedMarker.setMap(null);
            }
            if (this.markerList[this.markerList.length-1] != undefined) {
                this.markerList[this.markerList.length-1].setOptions({fillColor: '#00FF00', strokeColor: '#00FF00'});
            }
            this.markerList.push(marker);
        },

        addMarker: function(location, color){
            if (this.map == null)return;

            var latLng = new google.maps.LatLng(location.latitude, location.longitude);

            this.pushMarker(new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: 1,
                map: this.map,
                center: latLng,
                radius: 7
            }));

        }

    } // methods

});

app.initialize();