import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Routes definitions
const Index = () => import('../examples/Index.vue');
const Test_SearchBox = () => import('../examples/Test_SearchBox.vue');

// Routes binding with a specific page
const routes = [
	{ path : '/index', component : Index },
	{ path : '/test_searchbox', component : Test_SearchBox },

	{ path : '*', redirect : 'index' }
];

// Mount routes
const router = new VueRouter({ routes });
new Vue({ router }).$mount('#innerSearch');