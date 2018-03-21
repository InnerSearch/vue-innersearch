import Generics from './src/lib/Generics';
import Searchbox from './src/components/SearchBox';
import SearchDatalist from './src/components/SearchDatalist';
import Hits from './src/components/Hits';
import RefinementListFilter from './src/components/RefinementListFilter';
import SearchButton from './src/components/SearchButton';
import Paginate from './src/components/Paginate';
import PaginateAlt from "./src/components/Paginate.vue";

const InnerSearch = {
    Searchbox,
    SearchDatalist,
    Hits,
    RefinementListFilter,
    SearchButton,
    Paginate,
    PaginateAlt,

    install(Vue, options) {
        Vue.component('refinement-list-filter', RefinementListFilter);
        Vue.component('searchbox', Searchbox);
        Vue.component('search-datalist', SearchDatalist);
        Vue.component('search-button', SearchButton);
        Vue.component('hits', Hits);
        Vue.component('paginate', Paginate);

        Vue.mixin(Generics);
    }
};

export default InnerSearch;

export {
    Searchbox,
    SearchDatalist,
    Hits,
    RefinementListFilter,
    SearchButton,
    Paginate,
    PaginateAlt
};
