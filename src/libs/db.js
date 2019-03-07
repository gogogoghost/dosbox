import Dexie from 'dexie';

const dbName = 'dosbox';

export default class GameDB {

  //read database
  constructor(gameName) {
    this.db = new Dexie(dbName);
    let obj = {};
    this.db.version(1).stores({
      gameSave: '++id,game,name'
    });
    this.gameName = gameName;
  }

  /*
  * read files
  * */
  read(cb) {
    return this.db.gameSave.where('game').equals(this.gameName).each((obj) => {
      cb(obj.name, obj.files);
    })
  }

  /*
  * save files
  * */
  save(key, value) {
    value=value ? value.constructor == Uint8Array ? value : new Uint8Array(value) : new Uint8Array();
    return new Promise((resolve,reject)=>{
      this.db.gameSave.where('game').equals(this.gameName).and((val)=>{
        if(val.name==key)
          return true;
      }).toArray((arr)=>{
        if(arr.length==0){
          this.db.gameSave.put({
            game: this.gameName,
            name: key,
            files: value
          }).then(res=>{
            resolve(res);
          }).catch(err=>{
            reject(err);
          })
        }else{
          this.db.gameSave.where('game').equals(this.gameName).and((val)=>{
            if(val.name==key)
              return true;
          }).modify({
            files:value
          }).then(res=>{
            resolve(res);
          }).catch(err=>{
            reject(err);
          })
        }
      })
    })
  }

  /**
   * delete file
   * @param key
   * @returns {Dexie.Promise<number>}
   */
  delete(key) {
    return this.db.gameSave.where('game').equals(this.gameName).and((val)=>{
      if(val.name==key)
        return true;
    }).delete()
  }

  deleteAll() {
    return this.db.gameSave.where('game').equals(this.gameName).delete();
  }
}


