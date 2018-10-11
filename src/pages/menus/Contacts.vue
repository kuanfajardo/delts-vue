<template>
  <div class="contacts-page">
    <page-header :title="title"></page-header>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  name: 'contacts-page',
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
  .contacts-page {

  }
</style>
