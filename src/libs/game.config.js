import config from '../config'
export default {
  gameBaseUrl:config.staticBaseUrl+'games/',
  posterBaseUrl:config.staticBaseUrl+'posters/',
  list:require('./game')
}
