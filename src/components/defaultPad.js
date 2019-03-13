export default ()=>{
  const defaultPad={
    name:'默认键盘',
    direction: {
      isDirection:true,
      left: 20,
      bottom: 20,
      size: 160,
      //上右下左
      key: [38, 39, 40, 37]
    },
    keys: [{
      text: 'A',
      size: 75,
      right: 130,
      bottom: 50,
      key: 13
    }, {
      text: 'B',
      size: 75,
      right: 50,
      bottom: 100,
      key: 27
    }]
  }
  return defaultPad
}
