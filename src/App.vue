<template>
  <el-container>
    <el-header>

    </el-header>
    <el-main>
      <div>
        <canvas ref="main"></canvas>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import dosbox from './libs/dosbox'
  import gameConfig from './libs/game.config'
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
        dosbox(this.$refs.main,gameConfig.list[0]).then(()=>{
        });
      })
    }
  }
</script>

<style lang="scss" scoped>
  canvas{
    width:100%;
    height:calc(50%);
  }
</style>
