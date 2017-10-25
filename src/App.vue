<template>
  <section id="UserView">
    <div>Hello</div>
    <searchbox :autofocus="true" :realtime="true" :queries="['specialities.label']" :placeholder="'Search by ID'"></searchbox>
  </section>
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
