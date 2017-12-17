import Vue from 'vue';
import elasticsearch from "elasticsearch";
import Bodybuilder from 'bodybuilder';
import Store from './Store';

export default Vue.mixin({
    computed : {
      // Full Elasticsearch request
      Request : function() {
        return Object.assign(
          {
            index : this.Header.Index,
            type : this.Header.Type
          },
          {
            body : this.Body
          }
        );
      },

      // Request header (index, type, client)
      Header : () => {
        return Store.getters["Elasticsearch/GetHeader"];
      },

      // Request query (generated bodybuilder json request)
      Body : () => {
        return Store.getters["Elasticsearch/GetBody"];
      },

      // Instructions (contains bodybuilder functions)
      Instructions : () => {
        return Store.getters["Elasticsearch/GetInstructions"];
      }
    },

    methods : {
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
          Store Elasticsearch Body Setter
        */
        SetBody : (type) => {
          Store.commit("Elasticsearch/SetBody", type);
        },


        /*
          Store Elasticsearch Instructions Add
        */
        AddInstruction : (obj) => {
          Store.commit("Elasticsearch/AddInstruction", obj);
        },


        /*
          Mount full request
        */
        Mount : function() {
          // Bodybuilder object
          let BD = Bodybuilder().from(0).size(10);

          // Execute all instructions to create request
          this.Instructions.forEach(instr => {
            console.log("[Generics:Mount] Instr Args : ", instr.args);
            BD[instr.fun](...instr.args)
          });

          // Store the JSON request into the body
          this.SetBody(BD.build());

          // Debug
          console.log("[Generics:Mount] Body : ", Store.getters.GetBody);
          console.log("[Generics:Mount] Request : ", this.Request);
        },


        /*
          Execute ES request
        */
        Fetch : function() {
          // Fetch the hits
          this.Header.Client.search(this.Request).then(function (resp) {
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

          // Debug
          console.log("[Generics:Fetch] Work : ", "done");
        },

        
      /***
       *
       * @param field : field name of the aggs that we want to fetch
       * @constructor
       */
      GetAggs : function (field) {
        // Bodybuilder object
        let BD = Bodybuilder().size(0);


        // Store the JSON request into the body
        this.SetBody(
          BD
            .aggregation("terms",field)
            .build());

      },

/*
        // Triggered when user uses SearchBox component
        SearchOnBox : function (data) {
          var query = {
            index : this.Header.Index,
            type :this.Header.Type,
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
        }, */

        search : function () {
          var query = Store.getters.getQuery();
          this.Header.Client.search(query).then(function (resp) {
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
