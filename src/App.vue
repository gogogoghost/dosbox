<template>
  <div class="wrapper">

    <el-row class="full-height">
      <el-scrollbar class="full-height">
        <el-col :xs="24" :md="18" :xl="16" class="container">
          <div>
            <div class="header flex-ver-center">
              <img src="@/assets/dosbox.webp">
              <div>
                DOSBOX GAME MOBILE
              </div>
            </div>
            <div class="main-box">
              <el-row :gutter="20">
                <el-col :xs="24" :md="16" :xl="16">
                  <div ref="wrapper" class="relative">
                    <canvas ref="main"></canvas>
                    <div class="virtual-pad">
                      <div class="direction">
                        <div>
                          <span ref="directionBtn"></span>
                        </div>
                        <div ref="direction">
                        </div>
                      </div>
                      <div class="key-a flex-center" ref="keyA">
                        A
                      </div>
                      <div class="key-b flex-center" ref="keyB">
                        B
                      </div>
                    </div>
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
                      <el-button type="primary" @click="fullGame" size="small">全屏游戏</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="reloadGame" size="small">重新加载</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="screenshot" size="small">保存截图</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="clearDB" size="small">清空存档</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="exportDB" size="small">导出存档</el-button>
                    </el-col>
                    <el-col :md="12" :xl="8">
                      <el-button type="primary" @click="importDB" size="small">导入存档</el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>


            <div class="game-list">

              <el-input
                placeholder="搜索内容"
                v-model="search">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>

              <el-row :gutter="10">
                <el-col v-for="item,index in gameList" :key="index" :xs="8" :sm="8" :md="6" :xl="6">
                  <div class="game-item" @click="runGame(item)">
                    <img :style="`background-image:url('${item.poster?(baseUrl+item.poster):''}')`">
                    <div>{{item.title}}</div>
                  </div>
                </el-col>
              </el-row>
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
        {{loadStage==1?'加载DOSBOX环境':loadStage==2?'加载游戏包':'请稍候'}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import dosbox from './libs/dosbox'
  import gameConfig from './libs/game.config'
  import download from './libs/download'
  import {MessageBox,Message} from 'element-ui'


  let dosInstance=null;
  export default {
    data() {
      return {
        baseUrl: gameConfig.posterBaseUrl,
        gameList: gameConfig.list,
        search: '',
        shownList: [],
        //当前游戏信息
        runningGame: null,
        //弹窗信息
        loadingShown:false,
        loadStage:0,
        loadPercent:0,
      }
    },
    methods: {
      //按键模拟
      downKey(keyCode) {
        let down = new KeyboardEvent('keydown', {
          keyCode: keyCode,
          bubbles: true,
          cancelable: true,
        });
        this.$refs.main.dispatchEvent(down);
      },
      upKey(keyCode) {
        let up = new KeyboardEvent('keyup', {
          keyCode: keyCode,
          bubbles: true,
          cancelable: true,
        });
        this.$refs.main.dispatchEvent(up);
      },
      //全屏
      fullGame() {
        let el = this.$refs.wrapper;
        let request = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof request != "undefined" && request) {
          request.call(el);
        }
      },
      //启动游戏
      runGame(game) {
        //let load = this.$utils.showLoading();
        if(dosInstance){
          dosInstance.exit();
        }
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
            //load.close();
            dosInstance = dos;
            this.runningGame = game;
            this.loadingShown=false;
          })
          .catch(err => {
            //load.close();
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
          dosInstance.screenshot()
            .then(data=>{
              let byteString = atob(data.split(',')[1]);
              let ab = new ArrayBuffer(byteString.length);
              let ia = new Uint8Array(ab);

              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              let blob=new Blob([ab]);
              download('dos.png',blob);
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
      }
    },
    mounted() {
      this.$nextTick(() => {
        //给按钮赋予事件 A B
        let keyDown = (keyCode) => {
          let self = this;
          return function (evt) {
            evt.target.classList.add('key-touch');
            self.downKey(keyCode)
            evt.preventDefault();
          }
        }
        let keyUp = (keyCode) => {
          let self = this;
          return function (evt) {
            evt.target.classList.remove('key-touch')
            self.upKey(keyCode)
            evt.preventDefault();
          }
        }
        this.$refs.keyA.addEventListener('mousedown', keyDown(13));
        this.$refs.keyA.addEventListener('touchstart', keyDown(13));
        this.$refs.keyB.addEventListener('mousedown', keyDown(27));
        this.$refs.keyB.addEventListener('touchstart', keyDown(27));


        this.$refs.keyA.addEventListener('mouseup', keyUp(13));
        this.$refs.keyA.addEventListener('touchend', keyUp(13));
        this.$refs.keyB.addEventListener('mouseup', keyUp(27));
        this.$refs.keyB.addEventListener('touchend', keyUp(27));
        //摇杆
        let direction = 0;
        let directionBtn = this.$refs.directionBtn
        let getDirection = (x, y) => {
          if (x < 0 && x < y && y <= -x) {
            //left
            return 37;
          } else if (y > 0 && -y < x && x <= y) {
            //top
            return 38;
          } else if (x > 0 && -x <= y && y < x) {
            //right
            return 39;
          } else if (y < 0 && y <= x && x < -y) {
            //bottom
            return 40;
          } else {
            //default left
            return 0;
          }
        }
        //移动摇杆圆点
        let moveDirectionBtn = (x, y) => {
          //禁用摇杆移动
          return;
          directionBtn.style.left = x - directionBtn.offsetWidth / 2 + 'px'
          directionBtn.style.top = y - directionBtn.offsetHeight / 2 + 'px'
        }
        //摇杆归位
        let resetDirectionBtn = () => {
          directionBtn.style.left = '';
          directionBtn.style.top = '';
        }
        //摇杆移动
        let directActive = (evt) => {
          if (evt.constructor == TouchEvent) {
            evt.clientX = evt.targetTouches[0].clientX;
            evt.clientY = evt.targetTouches[0].clientY;
          }
          let dom = evt.target;
          let rect = dom.getBoundingClientRect();
          let x = -(dom.offsetWidth / 2 + rect.left - evt.clientX)
          let y = dom.offsetHeight / 2 + rect.top - evt.clientY
          changeDirection(getDirection(x, y));

          moveDirectionBtn(evt.clientX - rect.left, evt.clientY - rect.top);
        }
        let changeDirection = (mDirection) => {
          if (mDirection != direction) {
            if (direction != 0) {
              this.upKey(direction);
            }
            if (mDirection != 0) {
              this.downKey(mDirection)
            }
            direction = mDirection
          }
        }
        //事件
        let directionDown = function (evt) {
          directActive(evt);
          evt.preventDefault();
        }
        let directionMove = function (evt) {
          if (!direction)
            return;
          directActive(evt);
          evt.preventDefault();
        }
        let directionUp = function (evt) {
          changeDirection(0);
          resetDirectionBtn();
          evt.preventDefault();
        }
        this.$refs.direction.addEventListener('mousedown', directionDown)
        this.$refs.direction.addEventListener('touchstart', directionDown)
        this.$refs.direction.addEventListener('mousemove', directionMove)
        this.$refs.direction.addEventListener('touchmove', directionMove)
        this.$refs.direction.addEventListener('mouseup', directionUp)
        this.$refs.direction.addEventListener('touchend', directionUp)
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
      })
    }
  }
</script>
<style lang="scss">
  .main-box {
    .el-button {
      margin-left: 0 !important;
      margin-right: 10px !important;
      margin-bottom: 10px;
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
        padding-bottom:56.25%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      div {
        text-align: center;
        font-size: 14px;
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
    .virtual-pad {
      display: none;
    }
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
    .virtual-pad {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 999;
      top: 0;

      .direction {
        position: absolute;
        bottom: .2rem;
        left: .2rem;
        width: 1.6rem;
        height: 1.6rem;
        border: #8A8A8A solid 2px;
        border-radius: 50%;
        opacity: .5;
        background-color: #9D9D9D66;
        span {
          position: absolute;
          left: .6rem;
          top: .6rem;
          height: .4rem;
          width: .4rem;
          background-color: #8A8A8A;
          border-radius: 50%;
        }

        & > div:last-child {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 50%;
        }

        &:before {
          content: '';
          position: absolute;
          top: 50%;
          height: 0;
          width: 100%;
          left: 0;
          border-top: #8A8A8A solid 2px;
          transform: rotateZ(45deg);
        }

        &:after {
          content: '';
          position: absolute;
          top: 50%;
          height: 0;
          width: 100%;
          left: 0;
          border-top: #8A8A8A solid 2px;
          transform: rotateZ(-45deg);
        }
      }

      .key-a {
        position: absolute;
        right: 1.3rem;
        bottom: .5rem;
        color: #8A8A8A;
        border-radius: 50%;
        border: #8A8A8A solid 2px;
        width: .75rem;
        height: .75rem;
        opacity: .5;
        font-weight: bold;
        font-size: .24rem;
        background-color: #9D9D9D66;
      }

      .key-b {
        font-size: .24rem;
        font-weight: bold;
        position: absolute;
        right: .5rem;
        bottom: 1rem;
        color: #8A8A8A;
        border-radius: 50%;
        border: #8A8A8A solid 2px;
        width: .75rem;
        height: .75rem;
        opacity: .5;
        background-color: #9D9D9D66;
      }

      .key-touch {
        background-color: #8A8A8A;
        color: #DCDCDC;
      }
    }

    canvas {
      width: 100%;
      height:100%;
      background-color: black;
      display: block;
    }

    .title {
      font-size: 18px;
      margin: 10px 0;
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
