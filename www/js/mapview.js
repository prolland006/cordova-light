const MAX_NB_MARKER = 100;

var mapView = new Vue ({
    el: '#app',
    data: {
        map: null,
        markerList: this.markerList = new Array(MAX_NB_MARKER),
        waitDisplay: ''
    },
    methods: {
        initMap: function(location, color) {
            console.log('initMap');
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
            if (this.map === null) {
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

            if (this.markerList[this.markerList.length-1] !== undefined) {
                console.log('set option');
                this.markerList[this.markerList.length-1].setOptions({fillColor: '#00FF00', strokeColor: '#00FF00'});
            }
            this.markerList.push(marker);
        },

        addMarker: function(location, color){
            console.log('add marker');
            if (this.map === null)return;

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
