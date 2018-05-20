<template>
    <section v-if="hits.score != undefined || this.displayMap" class="is-component is-hits">
        <slot name="map" v-if="this.displayMap">
            <div class="google-map" id="mapGOOGLE"></div>
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
    import generics from './../lib/Generics';
    import { Component }  from '../lib/Enums.js';
    import loadGoogleMapsApi  from 'load-google-maps-api';

    export default {
        name : "hits",
        mixins : [generics],

        props : {
            displayMap : {
                type : Boolean,
                default : false,
            },
            mapKey : {
                type : String,
                default : ''
            }
        },

        data : function() {
            return {
                CID : undefined,
                mapName : "mapGOOGLE",
                map : undefined,
                markers : [],
                markerBounds : undefined
            }
        },

        computed : {
            hits : function() {
                return {
                    items : this.items,
                    score : this.score
                };
            }
        },

        watch : {
            hits : function () {
                this.clearMarkers();
                for( var i = 0; i < this.hits.items.length; i++ ){
                    this.addMarker(this.hits.items[i]._source.LATITUDE,this.hits.items[i]._source.LONGITUDE,this.hits.items[i]._source.NOM);
                }
            }
        },

        methods : {
            emptyHits : function() {
                this.clearItems();
                this.setScore(undefined);
            },
            addMarker : function (lat,lon,contentString) {
                if(lat !=="0" && lon !=="0"){
                    this.bus.$emit('addMarker',parseFloat(lat),parseFloat(lon),contentString);

                }
            },
            // Sets the map on all markers in the array.
            setMapOnAll : function (map) {
                for (var i = 0; i < this.markers.length; i++) {
                    this.markers[i].setMap(map);
                }
            },
            // Removes the markers from the map, but keeps them in the array.
            clearMarkers : function () {
                this.setMapOnAll(null);
                this.bus.$emit('resetMarkerBounds');
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
            if(this.displayMap){
                const options = {
                    key : this.mapKey,
                }
                loadGoogleMapsApi(options).then((google) => {
                    this.map = new google.Map(document.querySelector('#mapGOOGLE'), {
                    center: {
                        lat: 40.7484405,
                        lng: -73.9944191
                    },
                    zoom: 12
                    });

                    this.markerBounds = new google.LatLngBounds();

                    this.bus.$on('resetMarkerBounds' ,() => {
                        this.markerBounds = new google.LatLngBounds();
                    });


                    this.bus.$on('addMarker', (lat,lon,contentString) => {
                        var position = new google.LatLng(lat,lon);
                        var marker = new google.Marker({
                            position: position,
                            map: this.map
                        });
                        this.markers.push(marker);
                        var infowindow = new google.InfoWindow({
                            content: contentString
                        });
                        marker.addListener('click', function() {
                            infowindow.open(this.map, marker);
                        });
                        this.markerBounds.extend(position);
                        this.map.fitBounds(this.markerBounds);
                    });

                });
            }

        }
    };
</script>

<style>
.google-map {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: gray;
}
</style>
