var elasticsearch = require('elasticsearch');
export default {
    client : new elasticsearch.Client({ host: "https://qlap.limics.fr/search" }),
    index : "qlap"
};
