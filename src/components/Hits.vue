<template>
    <section v-if="hits.score != undefined" class="is-component is-hits">
        <slot name="hits" v-bind:hits="hits">
            <div class="is-score is-hits">
                <strong v-if="hits.score === 0">No result found</strong>
                <strong v-else-if="hits.score === 1">1 result found</strong>
                <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
            </div>
            <div v-for="(item, index) in hits.items" :key="index" :item="item">
                <div>[Hit]</div>
            </div>
        </slot>
    </section>
</template>

<script>
    import generics from './../lib/Generics';
    import { Component } from '../lib/Enums.js';

    export default {
        name : "hits",
        mixins : [generics],

        data : function() {
            return {
                CID : undefined
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

        created : function() {
            // Interactive component declaration
            this.CID = this.addComponent(Component.HITS, this);
        }
    };
</script>
<style>
    .is-component.is-hits {
        width : 90%;
        margin : 20px auto;
        padding : 15px;
        font-size : 1.25em;
        box-sizing : border-box;
    }

    .is-score.is-hits {
        margin : 10px 0 20px 50px;
        font-size : 1.75em;
        font-weight : bolder;
        font-variant : small-caps;
    }

    .is-item.is-hits {
        width : 90%;
        margin : 20px auto;
        padding : 20px;
        background : #EFEFEF;
    }

    .is-item.is-hits ul {
        margin : 0;
    }
</style>
