import Vue from 'vue';
import elasticsearch from "elasticsearch";
import Store from '@/lib/Store';

export default Vue.mixin({
    data : function () {
      return {
        Elasticsearch : {
          Client : {},
          Index : "",
          Type : "",
        }
      }
    },
    methods: {
        GetQuery : function(query) {
            let vals = query.split(".");
            return {
                type : vals[0],
                prop : vals[1]
            };
        },
        setHost : function (host) {
          this.Elasticsearch.Client = new elasticsearch.Client({
            host : host
          });
        },
        setIndex : function (index) {
          this.Elasticsearch.Index = index;
        },
        setType : function (type){
          this.Elasticsearch.Type = type;
        },
        searchOnBox : function (data) {
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
        search : function (){
          var query = Store.getters.getQuery();
          console.log(query);
          this.Elasticsearch.Client.search(query).then(function (resp) {
            Store.commit("Reset");
            var hits = resp.hits.hits;
            //console.log(resp);
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

    },

});
