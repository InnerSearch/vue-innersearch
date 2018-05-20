import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Routes definitions
const Index = () => import('../examples/Index.vue');
const Immo = () => import('../examples/Immo.vue');
const Test_SearchBox = () => import('../examples/Test_SearchBox.vue');
const Test_RefinementListFilter = () => import('../examples/Test_RefinementListFilter.vue');
const Test_RefinementListFilter2 = () => import('../examples/Test_RefinementListFilter2.vue');
const Test_multipleRLF = () => import('../examples/Test_multipleRLF.vue');
const Test_multipleRLF_Searchbox = () => import('../examples/Test_RLF_Searchbox.vue');
const Test_ResetButton = () => import('../examples/Test_ResetButton.vue');



// Routes binding with a specific page
const routes = [
	{ path : '/index', component : Index },
	{ path : '/immo', component : Immo },
	{ path : '/test_searchbox', component : Test_SearchBox },
	{ path : '/test_refinementListFilter', component : Test_RefinementListFilter },
	{ path : '/test_refinementListFilter2', component : Test_RefinementListFilter2 },
	{ path : '/test_multipleRLF', component : Test_multipleRLF },
	{ path : '/test_RLF_With_Searchbox', component : Test_multipleRLF_Searchbox },
	{ path : '/test_resetbutton', component : Test_ResetButton },

	{ path : '*', redirect : 'immo' }
];

// Mount routes
const router = new VueRouter({ routes });
new Vue({ router }).$mount('#innerSearch');
