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
        coord: 'no coord',
        trackerInterval: null
    },
    methods: {
        // Application Constructor
        initialize: function() {
            console.log('initialize');
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        },

        // deviceready Event Handler
        //
        // Bind any cordova events here. Common events are:
        // 'pause', 'resume', etc.
        onDeviceReady: function() {
            console.log('device ready');
            this.receivedEvent('deviceready');
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
            this.coord = position.coords.latitude + ',' + position.coords.longitude;

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
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        }
    } // methods

});

app.initialize();