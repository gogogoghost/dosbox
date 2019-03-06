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
  * */
  read(cb){
    return this.db[this.gameName].each((obj)=>{
      cb(obj.name,obj.files);
    })
  }

  /*
  * save files
  * */
  save(key,value){
    return this.db[this.gameName].put({
        name:key,
        files:value?value.constructor==Uint8Array?value:new Uint8Array(value):new Uint8Array()
      })
  }

  /**
   * delete file
   * @param key
   * @returns {Dexie.Promise<number>}
   */
  delete(key){
    return this.db[this.gameName].where('name').equals(key).delete()
  }
}


