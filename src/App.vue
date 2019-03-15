<template>
  <div class="wrapper" id="app">

    <el-row class="full-height">
      <el-scrollbar class="full-height">
        <el-col :xs="24" :md="22" :xl="18" class="container">
          <div>
            <div class="header flex-ver-center">
              <img src="@/assets/dosbox.webp">
              <div>
                DOSBOX GAME
              </div>
            </div>
            <div class="main-box">
              <el-row :gutter="20">
                <el-col :xs="24" :md="16" :xl="16">
                  <div ref="wrapper" class="relative">
                    <canvas ref="main"></canvas>
                    <Pad @catchmouse="catchMouse" @send="sendEvt" v-show="!hidePad"></Pad>
                    <div class="flex-center full-note hidden" ref="fullNote">
                      横屏体验更佳哦
                    </div>
                  </div>
                </el-col>
                <el-col :xs="24" :md="8" :xl="8">
                  <div class="title flex">
                    <div class="flex1">
                      {{runningGame?runningGame.title:'等待选择游戏'}}
                    </div>
                    <div class="small-tools flex">
                      <el-button type="primary" icon="el-icon-zoom-in" size="mini" @click="fullGame"></el-button>
                      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="reloadGame"></el-button>
                      <el-button type="primary" icon="el-icon-picture" size="mini" @click="screenshot"></el-button>
                      <el-button type="primary" icon="el-icon-delete" size="mini" @click="clearDB"></el-button>
                      <el-button type="primary" icon="el-icon-download" size="mini" @click="exportDB"></el-button>
                      <el-button type="primary" icon="el-icon-upload2" size="mini" @click="importDB"></el-button>
                    </div>
                  </div>
                  <el-row :gutter="10" class="big-tools">
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="fullGame">全屏游戏</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="reloadGame">重新加载</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="screenshot">保存截图</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="clearDB">清空存档</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="exportDB">导出存档</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="importDB">导入存档</el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>


            <div class="game-list">

              <el-input
                placeholder="游戏中文或者英文名"
                v-model="search">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>

              <el-row :gutter="10">
                <el-col v-for="item,index in shownList" :key="index" :xs="8" :sm="8" :md="6" :xl="6">
                  <div class="game-item" @click="runGame(item)">
                    <img :style="`background-image:url('${baseUrl}${item.poster||(item.name+'.webp')}')`">
                    <div class="break-ellipsis">{{item.title}}</div>
                  </div>
                </el-col>
              </el-row>
              <el-pagination
                layout="prev,pager,next"
                :total="pagerTotal.length"
                :page-size="pageSize"
                :pager-count="7"
                :current-page.sync="currentPage"
                background>
              </el-pagination>
            </div>
          </div>

        </el-col>
      </el-scrollbar>
    </el-row>

    <el-dialog
      :visible.sync="loadingShown"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="loadPercent"></el-progress>
      <div class="text-center loading-text">
        {{loadStage==1?'加载DOSBOX环境':loadStage==2?loadPercent>=99?'解压游戏包':'加载游戏包':'请稍候'}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import dosbox from './libs/dosbox'
  import gameConfig from './libs/game.config'
  import download from './libs/download'
  import {MessageBox,Message} from 'element-ui'
  import Pad from './components/pad'


  let dosInstance=null;
  export default {
    components:{
      Pad
    },
    data() {
      return {
        baseUrl: gameConfig.posterBaseUrl,
        gameList: gameConfig.list,
        search: '',
        //当前游戏信息
        runningGame: null,
        //弹窗信息
        loadingShown:false,
        loadStage:0,
        loadPercent:0,
        pageSize:12,
        currentPage:1,
        hidePad:false
      }
    },
    computed:{
      pagerTotal:{
        get(){
          if(!this.search){
            return this.gameList
          }
          let list=[];
          for(let item of this.gameList){
            if(item.name.indexOf(this.search)>=0||item.title.indexOf(this.search)>=0)
              list.push(item);
          }
          return list;
        }
      },
      shownList:{
        get(){
          let start=(this.currentPage-1)*this.pageSize
          let end=start+this.pageSize;
          let list=[];
          for(let i=start;i<end&&i<this.pagerTotal.length;i++){
            if(list.length==this.pageSize)
              break;
            list.push(this.pagerTotal[i]);
          }
          return list;
        }
      }
    },
    methods: {
      catchMouse(){
        let el = this.$refs.main;
        let request = el.requestPointerLock || el.mozRequestPointerLock || el.webkitRequestPointerLock;
        if (request) {
          request.call(el);
        }
      },
      //全屏
      fullGame() {
        let el = this.$refs.wrapper;
        let request = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (request) {
          request.call(el);
        }
      },
      //启动游戏
      runGame(game) {
        document.querySelector('.el-scrollbar__wrap').scrollTop=0;
        if(dosInstance){
          dosInstance.exit();
        }
        location.hash='#'+game.name
        this.loadStage=0;
        this.loadPercent=0;
        this.loadingShown=true;
        dosbox(
          this.$refs.main,
          game,
          (stage, total, loaded) => {
            this.loadStage=stage;
            let percent=loaded/total*100
            if(stage==1)
              percent=percent/2;
            else if(stage==2)
              percent=percent/2+50;
            this.loadPercent=parseInt(percent)
          })
          .then((dos) => {
            dosInstance = dos;
            this.runningGame = game;
            this.loadingShown=false;
            document.title=game.title;
          })
          .catch(err => {
            this.loadingShown=false;
            this.$utils.log(err);
            Message.error('加载失败');
          });
      },
      //重启游戏
      reloadGame() {
        if (dosInstance) {
          MessageBox.confirm('重启游戏请确保游戏进度已保存。','提示')
            .then(()=>{
              dosInstance.exit();
              this.runGame(this.runningGame);
            })
            .catch(()=>{})
        }
      },
      screenshot(){

        if(dosInstance){
          this.$refs.main.toBlob((blob)=>{
            download(`${this.runningGame.name}.png`,blob);
          })
        }
      },
      clearDB(){
        if(dosInstance){
          MessageBox.confirm('确定要删除所有已保存的存档吗？（当前游戏不受影响）','提示')
            .then(()=>{
              if(dosInstance){
                dosInstance.db.deleteAll();
              }
            })
            .catch(()=>{})
        }
      },
      exportDB() {
        if (dosInstance) {
          dosInstance.exportSaveFile();
        }
      },
      importDB() {
        if (dosInstance) {
          dosInstance.importSaveFile();
        }
      },
      //辅助发送事件
      sendEvt(evt){
        this.$refs.main.dispatchEvent(evt);
      }
    },
    mounted() {
      this.$nextTick(() => {
        //判断全屏 显示全屏提示
        window.addEventListener('resize',()=>{
          if(document.fullscreenElement){
            if(document.body.offsetHeight>document.body.offsetWidth){
              this.$refs.fullNote.classList.remove('hidden')
              return;
            }
          }
          this.$refs.fullNote.classList.add('hidden');
        })
        //加载默认游戏
        let gameName=location.hash.replace('#','');
        if(gameName){
          for(let item of this.gameList){
            if(item.name==gameName){
              this.runGame(item);
              break;
            }
          }
        }
        //监听鼠标锁定事件
        document.addEventListener('pointerlockchange', (evt) => {
          this.hidePad=document.pointerLockElement==this.$refs.main
        });
      })
    }
  }
</script>
<style lang="scss">
  .main-box {
    .big-tools{
      .el-button {
        margin-left:0 !important;
        margin-right: 10px !important;
        margin-bottom:10px;
      }
    }
  }
  .wrapper{
    .el-pagination{
      padding:0 0 20px 0;
    }
  }
</style>
<style lang="scss" scoped>
  .loading-text{
    margin-top:15px;
    font-size:17px;
  }
  .game-list {
    padding:0 10px;
    & > div:first-child {
      margin-bottom: 10px;
    }

    .game-item {
      padding: 5px;
      background-color: white;
      margin-bottom: 15px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: #66b1ff 0px 0 5px;

      img {
        width: 100%;
        height:0;
        padding-bottom:65.5%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      div {
        text-align: center;
        font-size: 12px;
      }
    }
  }

  .header {
    height: 56px;
    padding:0 10px;
    box-shadow: #A8A8A8 0 0 10px;
    img {
      width: 42px;
      margin-left: 10px;
      margin-right: 20px;
    }

    div {
      font-size: 28px;
      font-weight: bold;
      color: #8A8A8A;
    }
  }
  .big-tools{
    display: none;
  }
  @media only screen and (min-width: 992px) {
    .big-tools{
      display: block;
    }
    .small-tools{
      display: none;
    }
  }
  .full-note{
    position: absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
    color:white;
    font-size:18px;
    font-weight: bold;
    background-color: rgba(0,0,0,.5);
  }
  .main-box {
    padding: 10px;

    canvas {
      width: 100%;
      height:100%;
      background-color: black;
      display: block;
    }

    .title {
      font-size: 18px;
      margin: 10px 0;
      color:#6D6D6D;
      button{
        padding:5px;
        font-size:18px;
      }
    }

    button {
      width: 100%;
    }
  }

  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .container {
    margin: 0 auto;
    float: none;
    min-height: 100%;
    background-color: #DCDFE6;
    overflow: hidden;
  }

</style>
