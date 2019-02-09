<template>
  <div>
    <canvas ref="main"></canvas>
  </div>
</template>

<script>
  import DB from './libs/db'
  export default {
    name: 'app',
    data() {
      return {
        db:new DB('pal')
      }
    },
    created(){

    },
    methods:{

    },
    mounted() {
      this.$nextTick(()=>{
        Dos(this.$refs.main, {
          onprogress() {
            //console.log(arguments);
          },
          onerror() {
            //console.log(arguments)
          },
          wdosboxUrl:'/static/libs/js-dos/wdosbox.js'
        }).ready((fs, main) => {
          main([]).then(dos=>{
            dos.exec=function(args){
              return new Promise(resolve=>{
                this.shellInputClients.push(resolve);
                for(let arg of args){
                  this.shellInputQueue.push(arg);
                  this.requestShellInput();
                }
              })
            }
            return;
            fs.extract("/static/games/pal.zip").then(() => {
              dos.exec(['rescan']).then(res=>{
                console.log('done')
                console.log(dos.api.FS.readdir('/'))
                let data=dos.api.FS.readFile('/PAL.EXE')
                console.log(data);
                dos.api.FS.writeFile('/test.exe',data)
              })
              //shell(['pal!.exe']);
            }).catch((err)=>{
              console.log(err);
            });
          });
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
