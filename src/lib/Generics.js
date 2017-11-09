import Vue from 'vue';
import elasticsearch from "elasticsearch";

export default Vue.mixin({
    data : function () {
      return {
        Elasticsearch : {
          Client : {},
          Index : "",
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
          console.log(this.Elasticsearch.Client.transport.connectionPool._config.host);
          //console.log(this);
          //this.Elasticsearch.Client.transport.connectionPool._config.host = host;
          /*this.Elasticsearch.Client.transport.setHosts([
            host
          ])*/
        },
        setIndex : function (index) {
          this.Elasticsearch.Index = index;
        }
    },

});
