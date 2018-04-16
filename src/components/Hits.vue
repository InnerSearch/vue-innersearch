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

    export default {
        name : "hits",
        mixins : [generics],

        computed : {
            hits : function() {
                return {
                    items : this.items,
                    score : this.score
                };
            }
        }
    };
</script>
