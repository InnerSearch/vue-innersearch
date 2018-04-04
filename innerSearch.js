import Generics from './src/lib/Generics';
import Searchbox from './src/components/SearchBox';
import SearchDatalist from './src/components/SearchDatalist';
import RefinementListFilter from './src/components/RefinementListFilter';
import Paginate from './src/components/Paginate';
import SearchButton from './src/components/SearchButton';
import ResetButton from './src/components/ResetButton';
import Hits from './src/components/Hits';

const InnerSearch = {
    Searchbox,
    SearchDatalist,
    Hits,
    RefinementListFilter,
    SearchButton,
    ResetButton,
    Paginate,

    install(Vue, options) {
        Vue.component('searchbox', Searchbox);
        Vue.component('search-datalist', SearchDatalist);
        Vue.component('refinement-list-filter', RefinementListFilter);
        Vue.component('paginate', Paginate);
        Vue.component('search-button', SearchButton);
        Vue.component('reset-button', ResetButton);
        Vue.component('hits', Hits);

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
    Hits
};
