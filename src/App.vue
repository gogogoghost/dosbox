<template>
  <div class="wrapper">
    <el-row class="full-height">
      <el-col :xs="24" :md="18" :xl="16" class="container">

        <el-row :gutter="20" class="main-box">
          <el-col :xs="24" :md="16" :xl="16">
            <canvas ref="main"></canvas>
          </el-col>
          <el-col :xs="24" :md="8" :xl="8">
            <div class="title">
              等待选择游戏
            </div>
            <el-row :gutter="10">
              <el-col :xs="8" :sm="6" :md="12" :xl="8">
                <el-button @click="fullGame">全屏游戏</el-button>
              </el-col>
              <el-col :xs="8" :sm="6" :md="12" :xl="8">
                <el-button>重新加载</el-button>
              </el-col>
              <el-col :xs="8" :sm="6" :md="12" :xl="8">
                <el-button>保存存档</el-button>
              </el-col>
              <el-col :xs="8" :sm="6" :md="12" :xl="8">
                <el-button>加载存档</el-button>
              </el-col>
              <el-col :xs="8" :sm="6" :md="12" :xl="8">
                <el-button>导出存档</el-button>
              </el-col>
              <el-col :xs="8" :sm="6" :md="12" :xl="8">
                <el-button>导入存档</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </div>
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
      fullGame(){
        this.$refs.main.requestFullscreen();
      }
    },
    mounted() {
      this.$nextTick(()=>{
        /*dosbox(this.$refs.main,gameConfig.list[0]).then(()=>{
        });*/
      })
    }
  }
</script>
<style lang="scss">
  .main-box{
    .el-button{
      margin-left:0 !important;
      margin-right:10px !important;
      margin-bottom:10px;
    }
  }
</style>
<style lang="scss" scoped>
  .main-box{
    padding:20px;
    canvas{
      width:100%;
      height:calc(50%);
      background-color: black;
    }
    .title{
      text-align: center;
      font-size:20px;
      margin-bottom:20px;
    }
    button{
      width:100%;
    }
  }
  .wrapper{
    position: absolute;
    width:100%;
    height:100%;
  }
  .container{
    margin:0 auto;
    float: none;
    height:100%;
    background-color: #DCDFE6;
  }

</style>
