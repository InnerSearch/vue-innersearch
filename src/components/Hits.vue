<template>
    <section v-if="hits.score != undefined" class="is-component is-hits">
        <slot name="hits" v-bind:hits="hits"></slot>
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
