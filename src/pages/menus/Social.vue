<template>
  <div class="social-page">
    <page-header :title="title"></page-header>
    <!--<iframe width="1000px" height="3000px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQPPh1apdsOaFm-HwK0traE3XspFFjNwPKsiA4sjxnt1j-Jfw4QGHp3jQ7Wy3TbWqnYdSwww4fbApxb/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"></iframe>-->
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
  },

  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .social-page {

  }
</style>
