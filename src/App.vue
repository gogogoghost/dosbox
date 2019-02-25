<template>
  <div>
    <canvas ref="main"></canvas>
  </div>
</template>

<script>
  import dosbox from './libs/dosbox'
  import gameConfig from './libs/gameConfig'
  export default {
    name: 'app',
    data() {
      return {
      }
    },
    methods:{

    },
    mounted() {
      this.$nextTick(()=>{
        dosbox(this.$refs.main,gameConfig.list[0]).then(dos=>{
        });
      })
    }
  }
</script>

<style lang="scss" scoped>
  canvas{
    width:800px;
    height:600px;
  }
</style>
