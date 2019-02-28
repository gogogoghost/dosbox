import DB from './db'
import gameConfig from './game.config'

export default function(dom,game){
  return new Promise((resolve,reject)=>{
    Dos(dom, {
      onprogress() {},
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
                this.requestShellInput();
              }
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
          saveFileToDB(){
            let count=0;
            this.eachFile((file)=>{
              if(game.saveFile.test(file.toLowerCase())){
                let buf=this.api.FS.readFile(file).buffer;
                this.db.add(file,buf);
                count++;
              }
            })
            return new Promise((resolve,reject)=>{
              this.db.save.then(res=>{
                resolve(count);
              }).catch(err=>{
                reject(err);
              })
            })
          },
          //restore files
          readFileFromDB(){
            let count=0;
            this.db.eachFile((name,buf)=>{
              this.writeFile(name,new Uint8Array(buf));
              count++;
            })
            return count;
          },
          //export save file
          exportSaveFile(){
            let obj={
              name:game.name,
              db:{}
            };
            this.db.eachFile((name,buf)=>{
              obj.db[name]=Array.prototype.slice.call(new Uint8Array(buf));
            })
            let blob=new Blob([JSON.stringify(obj)]);
            let a=document.createElement('a');
            a.href=URL.createObjectURL(blob);
            a.download=game.name+'.json';
            a.style.display='none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
          }
        })
        fs.extract(`${gameConfig.baseUrl}${game.name}/${game.file}`).then(() => {
          dos.exec(['rescan']).then(()=>{
            dos.db=new DB(game.name);
            dos.db.read().then(()=>{
              dos.exec([game.command]).then(()=>{
                resolve(dos);
              }).catch(err=>{
                reject(err);
              })
            }).catch(err=>{
              reject('database read error:'+err.toString())
            })
          })
        }).catch((err)=>{
          reject('extract file error:'+err.toString());
        });
      });
    });
  })

}
