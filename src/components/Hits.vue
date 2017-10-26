<template>
    <section>
        <strong v-if="hits.score === 0">No result found</strong>
        <strong v-else-if="hits.score === 1">1 result found</strong>
        <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>

        <div style="margin : 20px 0;" v-for="item in hits.items">
            <div><strong>Name :</strong> {{ item._source.label }}</div>
        </div>
     </section>
</template>

<script>
    import Store from '@/lib/Store';
    import Generics from '@/lib/Generics';

    export default {
        name : "hits",
        mixins : [Generics],

        data : function() {
            return {
                hits : Store.state.hits
            };
        }
    };
</script>