<template>
    <div>
      <div class="virtual-pad" ref="pad">
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
    </div>
</template>

<script>
    export default {
      data(){
        return{
          direction:[]
        }
      },
      mounted() {
        this.$nextTick(()=>{
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

          this.$refs.keyA.addEventListener('click',function (evt) {
            evt.stopPropagation();
          })
          this.$refs.keyB.addEventListener('click',function (evt) {
            evt.stopPropagation();
          })
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
            if (evt.constructor == window.TouchEvent) {
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
          this.$refs.direction.addEventListener('click',function (evt) {
            evt.stopPropagation();
          })
        })
        //锁定鼠标
        this.$refs.pad.addEventListener('click',()=>{
          let el=this.$refs.main;
          let request=el.requestPointerLock||el.mozRequestPointerLock||el.webkitRequestPointerLock;
          if(request){
            request.call(el);
          }
        })
        //屏蔽右键选择
        this.$refs.pad.oncontextmenu=function () {
          return false;
        }
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
      color: white;
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
      color: white;
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
</style>
