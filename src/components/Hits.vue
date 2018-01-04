<template>
    <section v-if="hits.score != null" class="is-component is-hits">
        <slot name="hits" v-bind:hits="hits"></slot>
    </section>
</template>

<script>
    import Store from './../lib/store';

    export default {
        name : "hits",
        data : function() {
            return {
                hits : Store.state.hits,
                Generics : this.$parent,
            };
        }
    };
</script>
