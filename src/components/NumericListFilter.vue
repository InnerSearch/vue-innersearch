<template>
<div class="nlf">
    <input class="is-field" type="text" placeholder="from" />
    <input class="is-field" type="text" placeholder="to" />
</div>
</template>

<script>
import Generics from '../lib/Generics';




export default {
  name: "numeric-list-filter",
  mixins: [Generics],
  props: {
      from: {
          type: Number,
          default: 0
      },

      to: {
          type: Number,
          default: 100
      }
  }
}
</script>

<style lang="scss" scoped>

.nlf{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
}

</style>

