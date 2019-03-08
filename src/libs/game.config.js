import config from '../config'
export default {
  gameBaseUrl:config.staticBaseUrl+'games/',
  posterBaseUrl:config.staticBaseUrl+'posters/',
  list:[{
    name:'pal',
    title:'仙剑奇侠传一',
    file:'pal.zip',
    command:'PAL!',
    poster:'pal.webp'
  },{
    name:'hospital',
    title:'主题医院',
    file:'hospital.zip',
    command:'hospital',
    mount:'cdrom',
    speed:30000
  }]
}
