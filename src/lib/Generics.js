import Vue from 'vue';
import elasticsearch from "elasticsearch";
import Store from './Store';

export default Vue.mixin({
    computed : {
      Elasticsearch : function() {
        return this.GetElasticsearch();
      }
    },

    methods : {

        /*
          Store Elasticsearch Header Getters
        */
        GetElasticsearch : () => {
          return Store.getters["Elasticsearch/GetHeader"];
        },


        /*
          Store Elasticsearch Header Setters
        */
        SetHost : (host) => {
          Store.commit("Elasticsearch/SetHost", new elasticsearch.Client({ host }));
        },

        SetIndex : (index) => {
          Store.commit("Elasticsearch/SetIndex", index);
        },

        SetType : (type) => {
          Store.commit("Elasticsearch/SetType", type);
        },


        /*
          Store Elasticsearch Request Getters
        */



        /*
          Store Elasticsearch Request Setters
        */


        GetQuery : function(query) {
            let vals = query.split(".");
            return {
                type : vals[0],
                prop : vals[1]
            };
        },

        // Triggered when user uses SearchBox component
        SearchOnBox : function (data) {
          var query = {
            index : this.Elasticsearch.Index,
            type :this.Elasticsearch.Type,
            body : {
              from : 0,
              size : 100,
              query : {
                bool : {
                  must : {
                    prefix: {
                      [data.query]: data.val
                    }
                  }
                  ,
                  filter : {
                    bool : {
                      must: Store.getters.getFilters()
                    }
                  }
                }
              }
            }
          };
          Store.commit("setQuery",query);

          this.search();
        },

        search : function () {
          var query = Store.getters.getQuery();
          this.Elasticsearch.Client.search(query).then(function (resp) {
            Store.commit("Reset");
            var hits = resp.hits.hits;
            console.log("Debug Hits : ", resp);
            if (hits.length === 0) {
              Store.commit("Score", 0);
            }
            else {
              var score = 0;
              hits.forEach((obj) => {
                score++;
                Store.commit("Item", obj);
              });
              Store.commit("Score", resp.hits.total);
            }
          }, function (err) {
            Store.commit("Score", 0);
          });
        }
    }
});
