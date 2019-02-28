<template>
  <div class="wrapper">

      <el-row class="full-height">
        <el-scrollbar class="full-height">
        <el-col :xs="24" :md="18" :xl="16" class="container">

            <div>
              <div class="header flex-ver-center">
                <img src="@/assets/dosbox.webp">
                <div>
                  DOSBOX GAME
                </div>
              </div>

              <el-row :gutter="20" class="main-box">
                <el-col :xs="24" :md="16" :xl="16">
                  <canvas ref="main"></canvas>
                </el-col>
                <el-col :xs="24" :md="8" :xl="8">
                  <div class="title">
                    {{runningGame?runningGame.title:'等待选择游戏'}}
                  </div>
                  <el-row :gutter="10">
                    <el-col :xs="8" :sm="6" :md="12" :xl="8">
                      <el-button @click="fullGame" :disabled="!dos" type="info">全屏游戏</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="12" :xl="8">
                      <el-button @click="reloadGame" :disabled="!dos" type="info">重新加载</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="12" :xl="8">
                      <el-button @click="saveDB" :disabled="!dos" type="info">保存存档</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="12" :xl="8">
                      <el-button @click="loadDB" :disabled="!dos" type="info">加载存档</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="12" :xl="8">
                      <el-button @click="exportDB" :disabled="!dos" type="info">导出存档</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="12" :xl="8">
                      <el-button @click="importDB" :disabled="!dos" type="info">导入存档</el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <div class="game-list">

                <el-input
                  placeholder="搜索内容"
                  v-model="search">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>

                <el-row :gutter="20">
                  <el-col v-for="item,index in gameList" :key="index" :xs="8" :sm="8" :md="6" :xl="6">
                    <div class="game-item" @click="runGame(item)">
                      <img :src="baseUrl+item.name+'/'+item.poster">
                      <div>{{item.title}}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>


        </el-col>
        </el-scrollbar>
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
        baseUrl:gameConfig.baseUrl,
        gameList:gameConfig.list,
        search:'',
        shownList:[],
        //当前游戏信息
        dos:null,
        runningGame:null,
      }
    },
    methods:{
      //全屏
      fullGame(){
        this.$refs.main.requestFullscreen();
      },
      //启动游戏
      runGame(game){
        let load=this.$utils.showLoading();
        dosbox(this.$refs.main,game)
          .then((dos)=>{
            load.close();
            this.dos=dos;
            this.runningGame=game;
          })
          .catch(err=>{
            load.close();
            this.$utils.log(err);
            this.$message.error('加载失败');
          });
      },
      //重启游戏
      reloadGame(){
        if(this.dos){
          this.dos.exit();
          this.runGame(this.runningGame);
        }
      },
      saveDB(){
        let load=this.$utils.showLoading('保存中');
        if(this.dos){
          this.dos.saveFileToDB().then((count)=>{
            load.close();
            this.$message.success(`成功保存${count}个文件`)
          }).catch(err=>{
            this.$utils.log(err)
            load.close();
            this.$message.error('保存时遇到问题');
          })
        }
      },
      loadDB(){
        if(this.dos){
          let count=this.dos.readFileFromDB();
          this.$message.success(`已加载${count}个文件`);
        }
      },
      exportDB(){
        if(this.dos){
          this.dos.exportSaveFile();
        }
      },
      importDB(){
        if(this.dos){
          this.dos.importSaveFile((count)=>{
            if(count>=0){
              this.$message.success(`成功导入${count}个文件`);
            }else if(count==-1){
              this.$message.error('文件格式有误');
            }else if(count==-2){
              this.$message.error('非该游戏存档');
            }
          })
        }
      }
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
  .el-input__inner:focus {
    border-color: #8A8A8A!important;
    outline: 0;
  }
</style>
<style lang="scss" scoped>
  .game-list{
    border-top:#8A8A8A solid 1px;
    padding:20px 0;
    &>div:first-child{
      margin-bottom:20px;
    }
    .game-item{
      padding:5px;
      background-color: white;
      margin-bottom:15px;
      border-radius: 5px;
      cursor: pointer;
      img{
        width:100%;
      }
      div{
        text-align: center;
        font-size:14px;
      }
    }
  }
  .header{
    height:70px;
    border-bottom:#8A8A8A solid 1px;
    img{
      width:48px;
      margin-left:20px;
      margin-right:20px;
    }
    div{
      font-size:28px;
      font-weight: bold;
      color:#8A8A8A;
    }
  }
  .main-box{
    padding:20px 0;
    canvas{
      width:100%;
      background-color: black;
    }
    .title{
      text-align: center;
      font-size:20px;
      margin-bottom:20px;
      margin-top:10px;
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
    padding:20px;
    float: none;
    min-height:100%;
    background-color: #DCDFE6;
  }

</style>
