var elasticsearch = require('elasticsearch');
export default {
    Client : new elasticsearch.Client({ host: "https://qlap.limics.fr/search" }),
    Index : "qlap"
};