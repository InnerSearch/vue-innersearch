#vuex not working when bundle custom vue plugin

Hi, 

I have been working on creating a standalone JS file for [vue-innersearch](https://github.com/InnerSearch/vue-innersearch) which is a vue.js plugin

Everything is working fine when i npm run dev or npm run build but my build bundle config to generate the standalone file isn't working 

The problem seems to come from vuex that isn't mutating very well when the state is modified 