import Dexie from 'dexie';

const dbName='dosbox';

export default class GameDB {

  //read database
  constructor(gameName){
    this.db=new Dexie(dbName);
    this.db.version(1).stores({
      gameSave:'name'
    });
    this.gameName=gameName;
  }

  /*
  * read files
  * gameData:{fileName:fileData(arraybuffer)}
  * */
  read(){
    return new Promise((resolve,reject)=>{
      this.db.gameSave.where('name').equals(this.gameName).first().then(res=>{
        this.gameData=res?res.files:{};
        resolve(this.gameData);
      }).catch(err=>{
        reject(err);
      });
    })
  }

  /*
  * save files
  * */
  save(){
    return new Promise((resolve,reject)=>{
      this.db.gameSave.put({
        name:this.gameName,
        files:this.gameData
      }).then(res=>{
        console.log(res);
        resolve();
      }).catch(err=>{
        console.log(err);
        reject();
      })
    })
  }

  /*
  * clear all files
  * */
  clear(){
    this.gameData={};
  }

  /*
  * add a file
  * */
  add(name,buffer){
    this.gameData[name]=buffer;
  }

  /*
  * foreach
  * */
  eachFile(cb){
    for(let key in this.gameData){
      cb(key,this.gameData[key]);
    }
  }
}


