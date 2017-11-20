<template>
<div>
  <div v-for="item in items">
    <input
        type="checkbox"
        :name="item.key"
        :value="item.key"
        v-model="checkedItems"
        @change="toggleRefinement()">
    <label>{{ item.key }} ( {{ item.doc_count}} ) </label>
  </div>
</div>

</template>
<script>
  import Store from '@/lib/Store';

  export default {
    name : "refinement-list-filter",
    mixins : [],
    props: {
        field : {
          type : String,
          default : null
        },
        size : {
          type : Number,
          default : 20
        }
    },
    data : function() {
      return {
        items : null,
        checkedItems : [],
        Generics : this.$parent
      };
    },
    created: function () {
      /*
      * first request to fetch aggs buckets
      * */
      var vm = this; // to be able to access @this from the vue instance in the promise .then()
      this.Generics.Elasticsearch.Client.search({
        index : this.Generics.Elasticsearch.Index,
        type : this.Generics.Elasticsearch.Type,
        size : 0,
        body : {
          aggs : {
            [this.field] : {
              terms : {
                field : this.field,
                size : this.size
              }
            }
          }
        }
      }).then(function (resp) {
        /*
        * we save the buckets into vm.items
        * */
        vm.items = resp.aggregations[vm.field].buckets;

      },function () {

      });
    },
    methods : {
      toggleRefinement(){
        var obj = [];
        var vm = this;
        this.checkedItems.forEach(function (e){
          obj.push({ term : { [vm.field] : e }});
        });
        Store.commit("setFilter",obj);
        console.log("searchCall");
        this.Generics.search();
      }
    }
  };


</script>
