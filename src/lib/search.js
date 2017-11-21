/**
 * search.js
 * A query function wrapped up
 */
import esclient from "./ElasticSearch";
// esclient : an instance of elasticsearch.Client, defined in ElasticSearch.js
// key defined: host, index
//var elasticsearch = require("elasticsearch");
// var esclient = {
//     Client : new elasticsearch.Client({ host: "https://qlap.limics.fr/search" }),
//     Index : "qlap"
// };

const getQueryPairs = queryObj => {
    return queryObj.body.query.bool.must.prefix
}

const search = (queryLabel, queryString, options = {}) => {
    var query = {
            index : options.index || esclient.Index,
            type : options.type || "",
            body : {
              from : options.from || 0,
              size : options.size || 100,
              query : {
                bool : {
                  must : {
                    prefix: {
                      [queryLabel]: queryString
                    }
                  }
                  ,
                  filter : {
                    bool : {
                      must: options.filters || {}
                    }
                  }
                }
              }
            }
          }; 
    return esclient.Client.search(query)
}



// query("label", "ta").then(response => {
//     fs.writeFileSync("tmp1.json", JSON.stringify(getInfoList(response, "label")))
// }, err => {
//     throw err
// })

export default search;

