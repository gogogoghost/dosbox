import Dexie from 'dexie';

const dbName = 'dosbox';

export default class GameDB {

  //read database
  constructor(gameName) {
    this.db = new Dexie(dbName);
    let obj = {};
    this.db.version(1).stores({
      gameSave: 'name'
    });
    this.gameName = gameName;
  }

  genName(key) {
    return this.gameName + '_' + key;
  }

  restoreName(name) {
    let index = name.indexOf('_');
    return index>=0?name.substring(index+1,name.length):name;
  }

  /*
  * read files
  * */
  read(cb) {
    return this.db.gameSave.where('name').startsWith(this.gameName).each((obj) => {
      cb(this.restoreName(obj.name), obj.files);
    })
  }

  /*
  * save files
  * */
  save(key, value) {
    value = value ? value.constructor == Uint8Array ? value : new Uint8Array(value) : new Uint8Array();
    return this.db.gameSave.put({
      name: this.genName(key),
      files: value
    })
  }

  /**
   * delete file
   * @param key
   * @returns {Dexie.Promise<number>}
   */
  delete(key) {
    return this.db.gameSave.where('name').equals(this.genName(key)).delete()
  }

  deleteAll() {
    return this.db.gameSave.where('name').startsWith(this.gameName).delete();
  }
}


