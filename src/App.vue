<template>
<<<<<<< HEAD
  <section id="UserView">
    <div>Hello</div>
    <searchbox :autofocus="true" :realtime="true" :queries="['specialities.label']" :placeholder="'Search by ID'"></searchbox>
  </section>
=======
  <div id="app">
    <img src="./assets/logo.png">
    <input  class="searchbox">
    <router-view/>
  </div>
>>>>>>> 4ffc291e7d5b8bf8b30be23e86bb73a31aad65dc
</template>



<style>
#UserView {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
