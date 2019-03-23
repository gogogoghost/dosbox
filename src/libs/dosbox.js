import DB from './db'
import jszip from 'jszip'
import gameConfig from './game.config'
import download from './download'
import config from '../config'


export default function(dom,game,onprogress){
  return new Promise((resolve,reject)=>{
    Dos(dom, {
      onprogress(stage,total,loaded) {
        onprogress(stage.startsWith('Resolving')?1:2,total,loaded);
      },
      onerror() {},
      log(){},
      wdosboxUrl:config.staticBaseUrl+'libs/js-dos/wdosbox.js'
      //wdosboxUrl:'http://127.0.0.1:8082/wdosbox.js'
    }).ready((fs, main) => {
      fs.createFile('dosbox.conf',`
            [sdl]
            autolock=false
            sensitivity=100
            [cpu]
            cycles=fixed ${game.cpucy||3000}
            `);
      main(['-conf','dosbox.conf']).then(dos=>{
        Object.assign(dos,{
          //exec some dos command
          exec(args){
            return new Promise(resolve=>{
              this.shellInputClients.push(resolve);
              for(let arg of args){
                this.shellInputQueue.push(arg);
              }
              this.requestShellInput();
            })
          },
          //isDir
          isDir(path){
            try{
              return this.api.FS.isDir(this.api.FS.stat(path).mode)
            }catch (e) {
              return false;
            }
          },
          //isFile
          isFile(path){
            try{
              return this.api.FS.isFile(this.api.FS.stat(path).mode)
            }catch (e) {
              return false
            }
          },
          //ergodic files
          internalFile:['.','..','dev','home','proc','tmp'],
          eachFile(cb,root){
            root=root||'/';
            for(let item of this.api.FS.readdir(root)){

              let isInternal=false;
              for(let file of this.internalFile){
                if(file==item){
                  isInternal=true;
                }
              }
              if(isInternal)
                continue;

              let fullPath=root+item;
              if(this.isFile(fullPath)){
                cb(fullPath);
              }else if(this.isDir(fullPath)){
                this.eachFile(cb,fullPath+'/');
              }
            }
          },
          //write file
          writeFile(path,data){
            let pathList=path.split('/');
            let root=''
            for(let i=0;i<pathList.length;i++){
              if(pathList[i]){
                root+='/'+pathList[i]
                if(i==pathList.length-1){
                  //the last is file name
                  this.api.FS.writeFile(root,data)
                }else{
                  if(!this.isDir(root))
                    this.api.FS.mkdir(root);
                }
              }
            }
          },
          //save files
          saveFileToDB(file,buffer){
            this.db.save(file,buffer).catch(err=>{
              console.log(err);
            });
          },
          //restore files
          readFileFromDB(){
            return this.db.read((name,buf)=>{
              this.writeFile(name,buf);
            })
          },
          //export save file
          exportSaveFile(){
            let zip=new jszip();
            this.db.read((name,files)=>{
              name=name.substring(1,name.length);
              zip.file(name,files);
            }).then(()=>{
              zip.generateAsync({type:'blob'})
                .then(blob=>{
                  download(game.name+'_save.zip',blob);
                })
            })
          },
          //import save file from disk
          importSaveFile(){
            let input=document.createElement('input');
            input.type='file';
            input.style.display='none';
            input.addEventListener('change',()=>{
              if(input.files[0].type!='application/zip'){
              }else{
                let reader=new FileReader();
                reader.onload=()=>{
                  let zip=new jszip();
                  zip.loadAsync(reader.result)
                    .then(zip=>{
                      for(let name in zip.files){
                        if(zip.files[name].dir){
                          continue;
                        }
                        zip.file(name).async('uint8array')
                          .then(data=>{
                            name='/'+name;
                            this.saveFileToDB(name,data);
                            this.writeFile(name,data);
                          })
                      }
                    })
                }
                reader.readAsArrayBuffer(input.files[0]);
              }
            })
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          },
          watchFS(parent,childName,path){
            parent=parent||this.dos.FS;
            childName=childName||'root';
            path=path||'/'

            let isInternal=false;
            for(let file of this.internalFile){
              if(file==childName){
                isInternal=true;
              }
            }
            if(isInternal)
              return;

            let contents=parent[childName].contents;
            let isFolder=contents?contents.constructor==Object:false;
            if(isFolder){
              //is a folder
              for(let key in contents){
                this.watchFS(contents,key,path+key+'/');
              }
              let self=this;
              parent[childName].contents=new Proxy(parent[childName].contents,{
                set(target,key,value,proxy){
                  //新增文件夹
                  //console.log('set:'+path+key)
                  let result=Reflect.set(target,key,value,proxy);
                  if(contents.constructor==Object){
                    self.watchFS(contents,key,path+key+'/');
                  }
                  return result;
                },
                deleteProperty(target, key,proxy) {
                  let name=path+key
                  //删除文件
                  this.db.delete(name).catch(err=>{
                    console.log(err);
                  })
                  return Reflect.deleteProperty(target,key,proxy);
                }
              })
            }else{
              path=path.substring(0,path.length-1);
              let self=this;
              let time=parent[childName].timestamp;
              let saveWaitTimer=null;
              let fileUpdated=false;
              Object.defineProperty(parent[childName],'timestamp',{
                get(){
                  return time;
                },
                set(val){
                  time=val;
                  //将短时间内多次写入合并成一个
                  if(saveWaitTimer){
                    fileUpdated=true;
                  }else{
                    fileUpdated=false;
                    saveWaitTimer=setInterval(()=>{
                      if(!fileUpdated){
                        clearInterval(saveWaitTimer);
                        saveWaitTimer=null;
                        self.saveFileToDB(path,parent[childName].contents);
                      }
                      fileUpdated=false;
                    },500)
                  }
                }
              })
            }
          }
        })
        window.dosbox=dos;
        fs.extract(`${gameConfig.gameBaseUrl}${game.file}`).then(() => {
        //fs.extract(`/game/${game.file}`).then(() => {
          dos.db=new DB(game.name);
          dos.readFileFromDB().then(()=>{
            dos.watchFS()
            let command=['rescan'];

            if(game.mount){
              if(game.mount=='cdrom'){
                command.push('mount d . -t cdrom');
              }else if(game.mount=='floppy'){
                command.push('mount d . -t floppy');
              }else{
                command.push('imgmount d '+game.mount);
              }
            }


            command.push(game.command);

            dos.exec(command).then(()=>{
              resolve(dos);
            }).catch(err=>{
              dos.exit();
              reject('run command error:'+err.toString());
            })
          }).catch(err=>{
            dos.exit();
            reject('database error:'+err.toString());
          });
        }).catch((err)=>{
          dos.exit();
          reject('extract file error:'+err.toString());
        });
      });
    }).catch(err=>{
      reject('dosbox error:'+err.toString());
    });
  })

}
