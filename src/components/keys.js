const keys=[{
  name:'↑',
  key:38
},{
  name:'→',
  key:39
},{
  name:'↓',
  key:40
},{
  name:'←',
  key:37
},{
  name:'回车(Enter)',
  key:13
},{
  name:'取消(ESC)',
  key:27
},{
  name:'空格(Space)',
  key:8
}]

//add A-Z
for(let i=65;i<=90;i++){
  keys.push({
    name:String.fromCharCode(i),
    key:i
  })
}

export default keys
