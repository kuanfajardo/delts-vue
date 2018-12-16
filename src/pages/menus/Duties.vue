<template>
  <div class="duties-page">
    <page-header title="Duties"></page-header>
    <duties-picker></duties-picker>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import DutiesPicker from '../../components/DutiesPicker'

export default {
  name: 'duties-page',
  components: { DutiesPicker, PageHeader },
  data () {
    return {
      msg: 'msg'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .duties-page {

  }
</style>
