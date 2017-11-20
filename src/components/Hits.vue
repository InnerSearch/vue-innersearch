<template>
  <section>
    <strong v-if="hits.score === 0">No result found</strong>
    <strong v-else-if="hits.score === 1">1 result found</strong>
    <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>

    <slot style="margin : 20px 0;" v-for="item in hits.items" :item="item">

    </slot>
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
