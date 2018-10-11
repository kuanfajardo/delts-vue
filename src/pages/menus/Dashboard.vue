<template>
  <div class="dashboard-page">
    <page-header :title="title"></page-header>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  name: 'dashboard-page',
  components: { PageHeader },
  data () {
    return {
      msg: 'msg'
    }
  },

  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .dashboard-page {

  }
</style>
