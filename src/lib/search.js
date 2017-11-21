/**
 * search.js
 * A query function wrapped up
 */
import esclient from "./ElasticSearch";
// esclient : an instance of elasticsearch.Client, defined in ElasticSearch.js
// key defined: host, index

/**
 * Object => Object
 * @param {*} queryObj 
 * @returns {*} prefix
 */
const getQueryPairs = queryObj => {
    return queryObj.body.query.bool.must.prefix
}

/**
 * String, String, Object => Promise
 * @param {*} queryLabel 
 * @param {*} queryString 
 * @param {*} options 
 * @returns Promise pendingSearchQuery
 */
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


export default search;

