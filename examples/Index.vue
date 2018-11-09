<template>
    <div id='defaultForm'>
    </div>
</template>

<script>
    /*
        Simple way to use InnerSearch
    */

    import Vue from 'vue';
    import Vuex from 'vuex';
    import InnerSearch from "../src/innerSearch.js";
    import '../src/style.css';

    Vue.use(Vuex);

    const store = new Vuex.Store();
    Vue.use(InnerSearch, { store : store});
    console.log(new Vue);
    

    window.addEventListener('load', function () {
        new Vue({
            el: '#defaultForm',

            created : function () {
                console.log(this);
                // ES server configuration
                this.setHost('http://es.yinyan.fr');
                this.setIndex('bank');
                this.setType('account');

                // adding default search
                /*
                this.addInstruction({
                    fun : 'filter',
                    args : ['term','age','28']
                });
                */
                
            },

            template : `
                <section>
                    <h1 class='is-title'>innerSearch.js</h1>

                    <hr class='is-line' />

                    <div style="width : 90%; margin : 0 auto;">
                        <tag-filter :for="'searchbox'"></tag-filter>
                        <tag-filter :for="'rlf-list'" >
                            <template slot-scope="{ data }">
                                State : {{ data }}
                            </template>
                        </tag-filter>
                        <tag-filter :for="'rlf-radio'">
                            <template slot-scope="{ data }">
                                    Age : {{ data }}
                            </template>
                        </tag-filter>
                        <tag-filter :for="'rlf-check'">
                            <template slot-scope="{ data }">
                                Gender : {{ data }} 
                            </template>
                        </tag-filter>
                        <tag-filter :for="'nlf'"></tag-filter>
                        <tag-filter :for="'searchdatalist'">
                            <template slot-scope="{ data }">
                                {{ data._source.firstname }} {{ data._source.lastname }} (<strong>{{ data._source.gender }}</strong>)
                            </template>
                        </tag-filter>
                        <tag-filter :for="'searchdatalist'" :clearAll="true"></tag-filter>
                    </div>

                    <div class="is-columns">
                        <div class="is-column is-one-fifth">
                            <div>
                                <refinement-list-filter :id="'rlf-list'" :field="'state'" :search="true" :title="'State : '" :size="100"  orderKey="_count" orderDirection="desc" operator="AND">
                                    <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }"> 
                                        <select name="" id="test" v-model="checkedItems"  @change="clickOnItem(checkedItems)">
                                            <option selected="selected"></option>
                                            <option v-for="(item, index) in items" :value="item.key">
                                                    <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                                            </option>
                                        </select>
                                    </template>
                                    <template slot="viewmore"></template>
                                </refinement-list-filter>
                                <refinement-list-filter :id="'rlf-radio'" :field="'age'" :search="false" :title="'Age : '" :size="19"  orderKey="_count" orderDirection="desc" operator="OR">
                                    <template slot="title" slot-scope="{ title }">
                                        <h3 class="is-refinement-menu-title" style="width: fit-content;display: inline-block;margin-right: 120px;">{{title}}</h3>
                                    </template>
                                    <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }"> 
                                        <div  v-for="(item, index) in items" :key="index" class="is-item is-refinement-list">
                                            <input
                                            type="radio"
                                            name="age"
                                            :value="item.key"
                                            v-model="checkedItems"
                                            @change="clickOnItem(checkedItems)">
                                            <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} years old ( {{ item.doc_count }} )</label>
                                            <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
                                        </div>
                                    </template>
                                    <template slot="uncheck_all" slot-scope="{ uncheckAll }">
                                        <a href="#" v-on:click='uncheckAll()' style="font-size:0.8em">Clear</a>
                                    </template>
                                </refinement-list-filter>
                                <refinement-list-filter :id="'rlf-check'" :field="'gender'" :search="true" :size="100" :title="'Gender : '" :displayCount="true" operator="OR" ></refinement-list-filter>
                            </div>
                        </div>
                        <div class="is-column">
                            <div>
                                <searchbox :id="'searchbox'" :autofocus="true" :realtime="true" :timeout="200" :field="'firstname'" :placeholder="'Search by firstname'"></searchbox>

                                <search-datalist :id="'searchdatalist'" :realtime="true" :field="'lastname'" :suggestion="['firstname', 'lastname']">
                                    <template slot="items" slot-scope="{ item }">
                                        {{ item._source.firstname }} {{ item._source.lastname }} (<strong>{{ item._source.gender }}</strong>)
                                    </template>

                                    <template slot="nosuggestion" slot-scope="{ value }">
                                        Sorry, "{{ value }}" doesn't exist... :(
                                    </template>

                                    <template slot="suggestions" slot-scope="{ suggestion }">
                                        <span v-html="suggestion.highlight.firstname ? suggestion.highlight.firstname[0] : suggestion._source.firstname"></span>
                                        <span v-html="suggestion.highlight.lastname ? suggestion.highlight.lastname[0] : suggestion._source.lastname"></span>
                                    </template>
                                </search-datalist>
                                <numeric-list-filter :id="'nlf'" :field="'balance'">
                                    <template slot="header">
                                        <h3 class="is-nlf-title">Balance : </h3>
                                    </template>
                                </numeric-list-filter>
                                <div style="margin: 20px auto;width: 90%">
                                    <search-button></search-button>
                                    <reset-button></reset-button>
                                </div>
                                <hits>
                                    <template slot="hits" slot-scope="{ hits }">
                                        <div class="is-score is-hits">
                                            <strong v-if="hits.score === 0">No result found</strong>
                                            <strong v-else-if="hits.score === 1">1 result found</strong>
                                            <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
                                        </div>
                                        <div v-for="item in hits.items" :item="item">
                                            <div><strong>Identity (firstname, lastname) :</strong> {{ item._source.firstname }} {{ item._source.lastname }} ({{ item._source.state }}, {{ item._source.gender }} , {{item._source.balance}})</div>
                                        </div>
                                    </template>
                                </hits>

                                <paginate :previousText="'&#x2B9C; Previous page'" :nextText="'Next page &#x2B9E;'" :size="10"></paginate>
                            </div>
                         </div>
                    </div>
                </section>
            `
        });
    });

    export default {};
</script>