import DB from './db'
import jszip from 'jszip'
import gameConfig from './game.config'

export default function(dom,game,onprogress){
  return new Promise((resolve,reject)=>{
    Dos(dom, {
      onprogress(stage,total,loaded) {
        onprogress(stage.startsWith('Resolving')?1:2,total,loaded);
      },
      onerror() {},
      log(){},
      wdosboxUrl:'/static/libs/js-dos/wdosbox.js'
    }).ready((fs, main) => {
      main([]).then(dos=>{
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
            let count=0;
            this.db.read((name,buf)=>{
              this.writeFile(name,new Uint8Array(buf));
              count++;
            })
            return count;
          },
          //export save file
          exportSaveFile(){
            /*let obj={
              name:game.name,
              db:{}
            };
            this.db.eachFile((name,buf)=>{
              obj.db[name]=Array.prototype.slice.call(new Uint8Array(buf));
            })*/
            let zip=new jszip();
            this.db.read((name,files)=>{
              let pathList=name.split('/');
              let root='';
              let folder=zip;
              for(let i=0;i<pathList.length;i++){
                if(pathList[i]){
                  root+='/'+pathList[i]
                  if(i==pathList.length-1){
                    //the last is file name
                    console.log(pathList[i]);
                    folder.file(pathList[i],new Blob([files]),{binary:true})
                  }else{
                    console.log('folder',root)
                    folder=zip.folder(root);
                  }
                }
              }
            })
            zip.file('test.txt','123456');
            zip.generateAsync({type:'blob'})
              .then(blob=>{
                let a=document.createElement('a');
                a.href=URL.createObjectURL(blob);
                a.download=game.name+'.zip';
                a.style.display='none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              })
          },
          //import save file from disk
          importSaveFile(cb){
            let input=document.createElement('input');
            input.type='file';
            input.style.display='none';
            input.addEventListener('change',()=>{
              if(input.files[0].type!='application/json'){
                cb(-1);
              }else{
                let reader=new FileReader();
                reader.onload=()=>{
                  let obj;
                  //parse obj
                  try{
                    obj=JSON.parse(reader.result)
                  }catch (e) {
                    cb(-1);
                    return;
                  }
                  if(obj.name!=game.name){
                    cb(-2);
                    return;
                  }
                  //restore file
                  obj.db=obj.db||{}
                  for(let key in obj.db){
                    this.db.add(key,new Uint8Array(obj.db[key]).buffer);
                  }
                  this.db.save();
                  let count=this.readFileFromDB();
                  cb(count);
                }
                reader.readAsText(input.files[0]);
              }
            })
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          },
          listenFS(parent,childName,path){
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
                this.listenFS(contents,key,path+key+'/');
              }
              let self=this;
              parent[childName].contents=new Proxy(parent[childName].contents,{
                set(target,key,value,proxy){
                  //新增文件夹
                  //console.log('set:'+path+key)
                  let result=Reflect.set(target,key,value,proxy);
                  if(contents.constructor==Object){
                    self.listenFS(contents,key,path+key+'/');
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
              let contents=parent[childName].contents;
              path=path.substring(0,path.length-1);
              let self=this;
              Object.defineProperty(parent[childName],'contents',{
                get(){
                  return contents;
                },
                set(val){
                  contents=val;
                  if(!val){
                    self.saveFileToDB(path,null);
                  }else{
                    if(val.constructor==Uint8Array){
                      self.saveFileToDB(path,val.buffer);
                    }
                  }
                }
              })
            }
          }
        })
        fs.extract(`${gameConfig.gameBaseUrl}${game.file}`).then(() => {
          dos.db=new DB(game.name);
          dos.readFileFromDB();
          dos.exec(['rescan']).then(()=>{
            setTimeout(()=>{
              dos.listenFS();
            },1000)
            resolve(dos);
            return;
            dos.exec([game.command]).then(()=>{
              dos.listenFS();
              resolve(dos);
            }).catch(err=>{
              reject(err);
            })
          })
        }).catch((err)=>{
          reject('extract file error:'+err.toString());
        });
      });
    });
  })

}
