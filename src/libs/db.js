import Dexie from 'dexie';

const dbName='dosbox';

export default class GameDB {

  //read database
  constructor(gameName){
    this.db=new Dexie(dbName);
    let obj={};
    obj[gameName]='name'
    this.db.version(1).stores(obj);
    this.gameName=gameName;
  }

  /*
  * read files
  * gameData:{fileName:fileData(arraybuffer)}
  * */
  read(cb){
    this.db[this.gameName].each((obj)=>{
      cb(obj.name,obj.files);
    })
    /*return new Promise((resolve,reject)=>{

      this.db[this.gameName].where('name').equals(this.gameName).first().then(res=>{
        this.gameData=res?res.files:{};
        resolve(this.gameData);
      }).catch(err=>{
        reject(err);
      });
    })*/
  }

  /*
  * save files
  * */
  save(key,value){
    return this.db[this.gameName].put({
        name:key,
        files:value
      })
  }

  delete(key){
    return this.db[this.gameName].where('name').equals(key).delete()
  }

  /*
  * clear all files
  * */
  /*clear(){
    this.gameData={};
  }*/

  /*
  * add a file
  * buffer->arraybuffer
  * */
  /*add(name,buffer){
    this.gameData[name]=buffer;
  }*/

  /*
  * foreach
  * provide arraybuffer
  * need convert to Uint8array
  * */
  /*eachFile(cb){
    for(let key in this.gameData){
      cb(key,this.gameData[key]);
    }
  }*/
}


