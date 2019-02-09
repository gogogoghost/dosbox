import Dexie from 'dexie';

const dbName='dosbox';

export default class GameDB {
  constructor(gameName){
    this.db=new Dexie(dbName);
    this.db.version(1).stores({
      gameSave:'name,files'
    });
    this.files=this.db.gameSave.get(gameName);
    for(let key in this.files){
      console.log(key,this.files[key])
    }
  }
}
