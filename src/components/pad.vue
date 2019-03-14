<template>
  <div>
    <div class="virtual-pad" ref="pad">
      <div
        class="direction"
        :style="getStyle(currentPad.direction)">
        <div>
          <span ref="directionBtn"></span>
        </div>
        <div @mousedown.prevent="directionStart" @touchstart.prevent="directionStart"
             @mousemove.prevent="directionMove" @touchmove.prevent="directionMove"
             @mouseup.prevent="directionEnd" @touchend.prevent="directionEnd"
             @mouseout.prevent="directionEnd" @touchcancel.prevent="directionEnd"
             @click.stop="">
        </div>
      </div>
      <div
        v-for="key in currentPad.keys"
        class="key flex-center"
        :style="getStyle(key)"
        @mousedown.prevent="keyDown($event,key)"
        @touchstart.prevent="keyDown($event,key)"
        @click.stop=""
        @mouseup.prevent="keyUp($event,key)"
        @mouseout.prevent="keyUp($event,key)"
        @touchcancel.prevent="keyUp($event,key)"
        @touchend.prevent="keyUp($event,key)"
        @mousemove.prevent="keyMove($event)"
        @touchmove.prevent="keyMove($event)">
        {{key.text}}
      </div>
      <div class="edit-pad flex-center" v-show="editMode">
        <div class="flex-ver-center">
          <span>
            {{`${padSelectedIndex+1}/${padList.length}`}}
          </span>
          <i class="el-icon-caret-top" @click="beforePad"></i>
          <input v-model="currentPad.name"></input>
          <i class="el-icon-caret-bottom" @click="afterPad"></i>
          <i class="el-icon-plus" @click="addPad"></i>
          <i class="el-icon-delete" @click="deletePad"></i>


          <select v-if="currentKey" v-model="currentKey.key" class="key-select">
            <option v-for="key in availableKeys" :value="key.key">{{key.name}}</option>
          </select>
          <select v-else disabled class="key-select">
          </select>

          <input v-model="currentKey.text" v-if="currentKey&&!currentKey.isDirection" class="key-name"></input>
          <input v-else disabled class="key-name"></input>

          <select v-if="currentKey" v-model="positionRule">
            <option value="0">左上</option>
            <option value="1">右上</option>
            <option value="2">左下</option>
            <option value="3">右下</option>
          </select>
          <select v-else>
          </select>

          <i class="el-icon-zoom-in" @click="zoomIn"></i>
          <i class="el-icon-zoom-out" @click="zoomOut"></i>
          <i class="el-icon-plus" @click="addKey"></i>
          <i class="el-icon-delete" @click="deleteKey"></i>
        </div>
      </div>
      <div class="edit-switch" @click.stop="editMode=!editMode">
        <i class="el-icon-check" v-if="editMode"></i>
        <i class="el-icon-edit" v-else></i>
      </div>
    </div>
  </div>
</template>

<script>
  import keys from './keys'
  import defaultPad from './defaultPad'
  //方向键临时变量
  let currentDirection = 0;
  //移动按键临时变量
  let moveKeyObj=null;

  //触摸事件
  if(window.TouchEvent){
    TouchEvent.prototype.getClientX=function(){
      return this.targetTouches[0].clientX
    }
    TouchEvent.prototype.getClientY=function () {
      return this.targetTouches[0].clientY
    }
  }
  //滑动事件
  MouseEvent.prototype.getClientX=function () {
    return this.clientX
  }
  MouseEvent.prototype.getClientY=function () {
    return this.clientY
  }

  export default {
    data() {
      return {
        //编辑模式
        editMode:false,
        //键盘列表
        padList:[],
        padSelectedIndex:0,
        //当前正在编辑的Key
        currentKey:null,
        //可用按键
        availableKeys:keys,
        //按键定位规则
        positionRule:0,
      }
    },
    watch:{
      //编辑模式关闭时，保存数据
      editMode(){
        let str=JSON.stringify(this.padList);
        localStorage['padList']=str;
      },
      //当前按键变化时，读取并设置他的位置规则
      currentKey(){
        if(this.currentKey){
          let o=this.currentKey;
          if(o.left!=undefined&&o.top!=undefined){
            this.positionRule=0;
          }else if(o.top!=undefined&&o.right!=undefined){
            this.positionRule=1;
          }else if(o.left!=undefined&&o.bottom!=undefined){
            this.positionRule=2;
          }else if(o.right!=undefined&&o.bottom!=undefined){
            this.positionRule=3;
          }
        }
      },
      //位置规则变化时，设置位置变量
      positionRule(){
        if(this.currentKey){
          let o=this.currentKey;
          if(this.positionRule==0){
            if(!(o.left!=undefined&&o.top!=undefined)){
              o.left=o.left||o.right;
              o.top=o.top||o.bottom;
              delete o.right;
              delete o.bottom;
            }
          }else if(this.positionRule==1){
            if(!(o.right!=undefined&&o.top!=undefined)){
              o.right=o.right||o.left;
              o.top=o.top||o.bottom;
              delete o.left;
              delete o.bottom;
            }
          }else if(this.positionRule==2){
            if(!(o.left!=undefined&&o.bottom!=undefined)){
              o.left=o.left||o.right;
              o.bottom=o.bottom||o.top;
              delete o.right;
              delete o.top;
            }
          }else if(this.positionRule==3){
            if(!(o.right!=undefined&&o.bottom!=undefined)){
              o.right=o.right||o.left;
              o.bottom=o.bottom||o.top;
              delete o.left;
              delete o.top;
            }
          }
        }
      }
    },
    computed:{
      currentPad:{
        get(){
          this.currentKey=null;
          return this.padList[this.padSelectedIndex]
        }
      }
    },
    methods: {
      //增加一个key
      addKey(){
        let newKey={
          text:'',
          size:75,
          left:300,
          top:100,
          key:8
        }
        this.currentPad.keys.push(newKey);
        this.currentKey=newKey;
      },
      deleteKey(){
        if(this.currentKey){
          if(!this.currentKey.isDirection){
            let list=this.currentPad.keys
            for(let i=0;i<list.length;i++){
              if(list[i]==this.currentKey){
                list.splice(i,1);
                this.currentKey=null;
                break;
              }
            }
          }
        }
      },
      //移动按钮方法
      moveKeyStart(evt){
        moveKeyObj={
          x:evt.getClientX(),
          y:evt.getClientY(),
        }
      },
      moveKeyMove(evt){
        if(moveKeyObj&&this.currentKey){
          let moveX=evt.getClientX()-moveKeyObj.x;
          let moveY=evt.getClientY()-moveKeyObj.y;
          moveKeyObj.x=evt.getClientX();
          moveKeyObj.y=evt.getClientY();
          let o=this.currentKey;
          let fontSize=parseFloat(getComputedStyle(document.documentElement).fontSize);
          let x=moveX/fontSize*100;
          let y=moveY/fontSize*100;
          if(o.left){
            o.left+=x
          }else if(o.right){
            o.right-=x
          }
          if(o.top){
            o.top+=y
          }else if(o.bottom){
            o.bottom-=y
          }
        }
      },
      moveKeyEnd(){
        moveKeyObj=null;
      },
      //放大缩小
      zoomIn(){
        if(this.currentKey){
          this.currentKey.size+=3;
        }
      },
      zoomOut(){
        if(this.currentKey){
          this.currentKey.size-=3;
        }
      },
      beforePad(){
        this.padSelectedIndex--;
        if(this.padSelectedIndex<0)
          this.padSelectedIndex=this.padList.length-1;
      },
      afterPad(){
        this.padSelectedIndex++;
        if(this.padSelectedIndex>=this.padList.length)
          this.padSelectedIndex=0;
      },
      deletePad(){
        this.padList.splice(this.padSelectedIndex,1);
        this.padSelectedIndex=0;
        if(this.padList.length==0)
          this.padList.push(defaultPad())
      },
      //添加新键盘
      addPad(){
        let pad=defaultPad();
        pad.name='新增键盘';
        this.padList.push(pad);
        this.padSelectedIndex=this.padList.length-1;
      },
      getStyle(obj) {
        let style = '';
        //加入定位
        if (obj.left)
          style += `left:${obj.left / 100}rem;`;
        if (obj.top)
          style += `top:${obj.top / 100}rem;`;
        if (obj.bottom)
          style += `bottom:${obj.bottom / 100}rem;`;
        if (obj.right)
          style += `right:${obj.right / 100}rem;`;
        //加入size
        let size = obj.size / 100;
        style += `width:${size}rem;height:${size}rem;`
        return style;
      },
      keyDown(evt, key) {
        if(this.editMode){
          this.currentKey=key;
          this.moveKeyStart(evt);
          return;
        }
        if (evt) {
          evt.target.classList.add('key-touch');
        }
        this.$emit('downkey', key.key)
      },
      keyUp(evt, key) {
        if(this.editMode){
          this.moveKeyEnd();
          return;
        }
        if (evt) {
          evt.target.classList.remove('key-touch')
        }
        this.$emit('upkey', key.key)
      },
      keyMove(evt){
        if(this.editMode)
          this.moveKeyMove(evt);
      },
      directionStart(evt) {
        if(this.editMode){
          this.moveKeyStart(evt);
          let direction=this.getDirection(evt)
          if(direction<0)
            return;
          let self=this;
          this.currentKey=new Proxy(this.currentPad.direction,{
            get(target,key){
              if(key=='key'){
                return target.key[direction]
              }else{
                return target[key]
              }
            },
            set(target,key,value){
              if(key=='key'){
                self.currentPad.direction.key[direction]=value;
              }else{
                target[key]=value;
              }
              return true;
            }
          })
          return;
        }
        this.directionActive(evt);
      },
      directionMove(evt) {
        if(this.editMode){
          this.moveKeyMove(evt)
          return;
        }
        if (!currentDirection)
          return;
        this.directionActive(evt);
      },
      directionEnd() {
        if(this.editMode){
          this.moveKeyEnd()
          return;
        }
        this.changeDirection(0);
      },
      directionActive(evt) {
        this.changeDirection(this.currentPad.direction.key[this.getDirection(evt)]||0);
      },
      changeDirection(mDirection) {
        if (mDirection != currentDirection) {
          if (currentDirection != 0) {
            this.$emit('upkey', currentDirection);
          }
          if (mDirection != 0) {
            this.$emit('downkey', mDirection)
          }
          currentDirection = mDirection
        }
      },
      getDirection(evt) {
        let dom = evt.target;
        let rect = dom.getBoundingClientRect();
        let x=-(dom.offsetWidth / 2 + rect.left - evt.getClientX())
        let y=dom.offsetHeight / 2 + rect.top - evt.getClientY()

        if (x < 0 && x < y && y <= -x) {
          //left
          return 3;
        } else if (y > 0 && -y < x && x <= y) {
          //top
          return 0;
        } else if (x > 0 && -x <= y && y < x) {
          //right
          return 1;
        } else if (y < 0 && y <= x && x < -y) {
          //bottom
          return 2;
        } else {
          //default left
          return -1;
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        //锁定鼠标
        this.$refs.pad.addEventListener('click', () => {
          if(!this.editMode){
            this.$emit('catchmouse');
          }
        })
        //屏蔽右键选择
        this.$refs.pad.oncontextmenu = function () {
          return false;
        }
      })
    },
    created() {
      let padList=JSON.parse(localStorage['padList']||null)||[];
      if(padList.length==0){
        padList.push(defaultPad())
      }
      this.padList=padList;
      this.padSelectedIndex=0;
    }
  }
</script>

<style scoped lang="scss">
  @media only screen and (min-width: 992px) {
    .virtual-pad > * {
      display: none;
    }
  }

  .virtual-pad {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999;
    overflow: hidden;
    top: 0;

    .direction {
      position: absolute;
      border: #8A8A8A solid 2px;
      border-radius: 50%;
      opacity: .5;
      background-color: #9D9D9D66;
      cursor: pointer;

      span {
        position: absolute;
        left: 35%;
        top: 35%;
        height: 30%;
        width: 30%;
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
    .key {
      position: absolute;
      color: white;
      border-radius: 50%;
      border: #8A8A8A solid 2px;
      opacity: .5;
      font-weight: bold;
      font-size: .24rem;
      background-color: #9D9D9D66;
      cursor: pointer;
    }
    .key-touch {
      background-color: #8A8A8A;
      color: #DCDCDC;
    }
    .edit-switch{
      position: absolute;
      top:-.4rem;
      right:-.4rem;
      width:.8rem;
      height:.8rem;
      border-radius: 50%;
      border: #8A8A8A solid 2px;
      opacity: .5;
      cursor: pointer;
      i{
        position: absolute;
        bottom:.13rem;
        left:.13rem;
        color:#8A8A8A;
        font-size:.24rem;
      }
    }
    .edit-pad{
      position: absolute;
      top:-3px;
      text-align: center;
      width:100%;
      &>div{
        border-radius: 6px;
        border: #8A8A8A solid 2px;
        border-top:none;
        padding:.08rem;
        color:#8A8A8A;
        font-size:.22rem;
        &>input{
          width:.8rem;
          padding:.03rem;
          border-radius: 6px;
          border:none;
          color:#8A8A8A;
          height:.25rem;
          font-size:.18rem;
        }
        &>.key-name{
          width:.3rem;
        }
        &>select{
          height:.3rem;
          width:.7rem;
          padding:.03rem;
          border: none;
          font-size:.18rem;
          margin:0 .03rem;
          color:#8A8A8A;
        }
        &>.key-select{
          margin-left:.2rem;
        }
        i{
          background-color: #D0D0D0;
          border-radius: 3px;
          margin:.03rem;
          padding:.03rem;
          cursor: pointer;
        }
        span{
          font-size:.2rem;
        }
      }
    }
  }
</style>
