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
      this.db.read();
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
          log(){

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
            if(false){
              this.db.eachFile((name,buffer)=>{
                dos.api.FS.mkdir('/dir')
                dos.api.FS.writeFile('/dir/'+name,new Uint8Array(buffer))
              })
              return;
            }

            fs.extract("/static/games/pal.zip").then(() => {
              dos.exec(['rescan']).then(res=>{
                console.log('done')
                console.log(dos.api.FS.readdir('/tmp'))
                console.log(dos.api.FS);
                let n='/PAL.EXE'
                console.log(dos.api.FS.isDir(dos.api.FS.stat('/tmp').mode))
                /*try{
                  if(dos.api.FS.readFile('/no')){
                    console.log('true');
                  }else{
                    console.log('false')
                  }
                }catch (err) {
                  console.log(err)
                }*/

                return;
                let name='/PAL!.EXE'
                let data=dos.api.FS.readFile(name)
                console.log(data);
                this.db.clear();
                this.db.add(name,data.buffer);
                this.db.save();
                //this.db.add('pal.exe',data.arraybuffer);
                //dos.api.FS.writeFile('/test.exe',data)
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
