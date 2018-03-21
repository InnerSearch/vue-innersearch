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



// Routes binding with a specific page
const routes = [
	{ path : '/index', component : Index },
	{ path : '/immo', component : Immo },
	{ path : '/test_searchbox', component : Test_SearchBox },
	{ path : '/test_refinementListFilter', component : Test_RefinementListFilter },
	{ path : '/test_refinementListFilter2', component : Test_RefinementListFilter2 },
	{ path : '/test_multipleRLF', component : Test_multipleRLF },

	{ path : '*', redirect : 'index' }
];

// Mount routes
const router = new VueRouter({ routes });
new Vue({ router }).$mount('#innerSearch');
