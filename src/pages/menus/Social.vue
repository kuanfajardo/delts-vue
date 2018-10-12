<template>
  <div class="social-page">
    <page-header title="Social"></page-header>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  name: 'social-page',
  components: { PageHeader },
  data () {
    return {
      msg: 'msg'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .social-page {

  }
</style>
