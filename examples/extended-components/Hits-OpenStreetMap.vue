<template>
    <section class="is-component is-hits">
        <h3>Open Street Map </h3>
        <slot name="map">
            <div class="google-map" id="openStreetMap"></div>
        </slot>
        <slot name="hits" v-bind:hits="hits">
            <div class="is-score is-hits">
                <strong v-if="hits.score === 0">No result found</strong>
                <strong v-else-if="hits.score === 1">1 result found</strong>
                <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
            </div>
            <div v-for="(item, index) in hits.items" :key="index" :item="item">
                <div>{{ item }}</div>
            </div>
        </slot>
    </section>
</template>

<script>
    import { Hits,Component }  from "../../src/innerSearch.js";
    import loadGoogleMapsApi  from 'load-google-maps-api';
    import * as L from 'leaflet' 

    export default {
        name : "openstreetmap-hits",
        extends : Hits,

        props : {
            leaftletToken : {
                type : String,
                default : ''
            }
        },

        data : function() {
            return {
                map : undefined,
                markers : [],
                markerBounds : undefined
            }
        },

        watch : {
            hits : function () {
                this.clearMarkers();
                this.hits.items.forEach( (item) => {
                    let lat = item._source.Coord[1];
                    let lon = item._source.Coord[0];
                    let name = item._source.Dba;
                    this.addMarker(lat,lon,name);
                });
            }
        },

        methods : {
            addMarker : function (lat,lon,contentString) {
                if(lat !=="0" && lon !=="0"){
                    this.bus.$emit('addMarkerLeaflet',parseFloat(lat),parseFloat(lon),contentString);
                }
            },
            // Removes the markers from the map, but keeps them in the array.
            clearMarkers : function () {
                for (var i = 0; i < this.markers.length; i++) {
                    this.map.removeLayer(this.markers[i]);
                }
                this.markers = [];
            },
        },



        created : function() {
            // Interactive component declaration
            this.CID = this.addComponent(Component.HITS, this);

            this.bus.$on('emptyHits', () => {
                this.emptyHits();
            });
        },
        mounted: function () {

                this.map = L.map('openStreetMap').setView([40.7484405, -73.9944191], 12);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 12,
                    id: 'mapbox.streets',
                    accessToken: this.leaftletToken
                }).addTo(this.map); 

                this.bus.$on('addMarkerLeaflet', (lat,lon,contentString) => {

                    var position = L.latLng(lat,lon);
                    var marker = L.marker(position,{
                        title : contentString, 
                    }).addTo(this.map);

                    this.markers.push(marker);

                    var markerGroup = new L.featureGroup(this.markers);
                    this.map.fitBounds(markerGroup.getBounds());
                });
        }
    };
</script>

<style>
@import url("https://unpkg.com/leaflet@1.3.4/dist/leaflet.css");
.google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
}
</style>
