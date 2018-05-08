import Generics from './lib/Generics';
import Searchbox from './components/SearchBox';
import SearchDatalist from './components/SearchDatalist';
import RefinementListFilter from './components/RefinementListFilter';
import Paginate from './components/Paginate';
import SearchButton from './components/SearchButton';
import ResetButton from './components/ResetButton';
import TagFilter from './components/TagFilter';
import Hits from './components/Hits';
import NumericListFilter from "./components/NumericListFilter"

const InnerSearch = {
    Searchbox,
    SearchDatalist,
    Hits,
    RefinementListFilter,
    SearchButton,
    ResetButton,
    TagFilter,
    Paginate,
    NumericListFilter,

    install(Vue, options) {
        Vue.component('searchbox', Searchbox);
        Vue.component('search-datalist', SearchDatalist);
        Vue.component('refinement-list-filter', RefinementListFilter);
        Vue.component('paginate', Paginate);
        Vue.component('search-button', SearchButton);
        Vue.component('reset-button', ResetButton);
        Vue.component('tag-filter', TagFilter);
        Vue.component('hits', Hits);
        Vue.component("numeric-list-filter", NumericListFilter);

        Vue.mixin(Generics);
    }
};

export default InnerSearch;

export {
    Searchbox,
    SearchDatalist,
    RefinementListFilter,
    Paginate,
    SearchButton,
    ResetButton,
    TagFilter,
    Hits,
    NumericListFilter,
    Generics
};
