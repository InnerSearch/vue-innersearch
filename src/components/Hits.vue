<template>
    <section>
        <slot name="hits" v-bind:hits="hits"></slot>
    </section>
</template>

<script>
    import Store from '@/lib/Store';

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
