(function(e){function t(t){for(var a,o,s=t[0],l=t[1],c=t[2],f=0,d=[];f<s.length;f++)o=s[f],i[o]&&d.push(i[o][0]),i[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);u&&u(t);while(d.length)d.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],a=!0,s=1;s<n.length;s++){var l=n[s];0!==i[l]&&(a=!1)}a&&(r.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},i={app:0},r=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var u=l;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"527d":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var a=n("2b0e"),i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrapper"},[a("el-row",{staticClass:"full-height"},[a("el-scrollbar",{staticClass:"full-height"},[a("el-col",{staticClass:"container",attrs:{xs:24,md:18,xl:16}},[a("div",[a("div",{staticClass:"header flex-ver-center"},[a("img",{attrs:{src:n("e5d3")}}),a("div",[e._v("\n                DOSBOX GAME\n              ")])]),a("el-row",{staticClass:"main-box",attrs:{gutter:20}},[a("el-col",{attrs:{xs:24,md:16,xl:16}},[a("canvas",{ref:"main"})]),a("el-col",{attrs:{xs:24,md:8,xl:8}},[a("div",{staticClass:"title"},[e._v("\n                  "+e._s(e.runningGame?e.runningGame.title:"等待选择游戏")+"\n                ")]),a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{xs:8,sm:6,md:12,xl:8}},[a("el-button",{attrs:{disabled:!e.dos,type:"info"},on:{click:e.fullGame}},[e._v("全屏游戏")])],1),a("el-col",{attrs:{xs:8,sm:6,md:12,xl:8}},[a("el-button",{attrs:{disabled:!e.dos,type:"info"},on:{click:e.reloadGame}},[e._v("重新加载")])],1),a("el-col",{attrs:{xs:8,sm:6,md:12,xl:8}},[a("el-button",{attrs:{disabled:!e.dos,type:"info"},on:{click:e.saveDB}},[e._v("保存存档")])],1),a("el-col",{attrs:{xs:8,sm:6,md:12,xl:8}},[a("el-button",{attrs:{disabled:!e.dos,type:"info"},on:{click:e.loadDB}},[e._v("加载存档")])],1),a("el-col",{attrs:{xs:8,sm:6,md:12,xl:8}},[a("el-button",{attrs:{disabled:!e.dos,type:"info"},on:{click:e.exportDB}},[e._v("导出存档")])],1),a("el-col",{attrs:{xs:8,sm:6,md:12,xl:8}},[a("el-button",{attrs:{disabled:!e.dos,type:"info"},on:{click:e.importDB}},[e._v("导入存档")])],1)],1)],1)],1),a("div",{staticClass:"game-list"},[a("el-input",{attrs:{placeholder:"搜索内容"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}},[a("i",{staticClass:"el-input__icon el-icon-search",attrs:{slot:"prefix"},slot:"prefix"})]),a("el-row",{attrs:{gutter:20}},e._l(e.gameList,function(t,n){return a("el-col",{key:n,attrs:{xs:8,sm:8,md:6,xl:6}},[a("div",{staticClass:"game-item",on:{click:function(n){return e.runGame(t)}}},[a("img",{attrs:{src:e.baseUrl+t.name+"/"+t.poster}}),a("div",[e._v(e._s(t.title))])])])}),1)],1)],1)])],1)],1)],1)},r=[],o=(n("6b54"),n("f499")),s=n.n(o),l=(n("7f7f"),n("34ef"),n("28a5"),n("5d73")),c=n.n(l),u=n("5176"),f=n.n(u),d=n("795b"),p=n.n(d),h=n("d225"),m=n("b0b4"),v=n("74ce"),b="dosbox",g=function(){function e(t){Object(h["a"])(this,e),this.db=new v["a"](b),this.db.version(1).stores({gameSave:"name"}),this.gameName=t}return Object(m["a"])(e,[{key:"read",value:function(){var e=this;return new p.a(function(t,n){e.db.gameSave.where("name").equals(e.gameName).first().then(function(n){e.gameData=n?n.files:{},t(e.gameData)}).catch(function(e){n(e)})})}},{key:"save",value:function(){var e=this;return new p.a(function(t,n){e.db.gameSave.put({name:e.gameName,files:e.gameData}).then(function(e){t()}).catch(function(e){n()})})}},{key:"clear",value:function(){this.gameData={}}},{key:"add",value:function(e,t){this.gameData[e]=t}},{key:"eachFile",value:function(e){for(var t in this.gameData)e(t,this.gameData[t])}}]),e}(),x={baseUrl:"/static/games/",list:[{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/},{name:"pal",title:"仙剑奇侠传一",file:"pal.zip",command:"PAL!.EXE",poster:"pal.webp",saveFile:/.rpg$/}]},w=function(e,t){return new p.a(function(n,a){Dos(e,{onprogress:function(){},onerror:function(){},log:function(){},wdosboxUrl:"/static/libs/js-dos/wdosbox.js"}).ready(function(e,i){i([]).then(function(i){f()(i,{exec:function(e){var t=this;return new p.a(function(n){t.shellInputClients.push(n);var a=!0,i=!1,r=void 0;try{for(var o,s=c()(e);!(a=(o=s.next()).done);a=!0){var l=o.value;t.shellInputQueue.push(l),t.requestShellInput()}}catch(u){i=!0,r=u}finally{try{a||null==s.return||s.return()}finally{if(i)throw r}}})},isDir:function(e){try{return this.api.FS.isDir(this.api.FS.stat(e).mode)}catch(t){return!1}},isFile:function(e){try{return this.api.FS.isFile(this.api.FS.stat(e).mode)}catch(t){return!1}},internalFile:[".","..","dev","home","proc","tmp"],eachFile:function(e,t){t=t||"/";var n=!0,a=!1,i=void 0;try{for(var r,o=c()(this.api.FS.readdir(t));!(n=(r=o.next()).done);n=!0){var s=r.value,l=!1,u=!0,f=!1,d=void 0;try{for(var p,h=c()(this.internalFile);!(u=(p=h.next()).done);u=!0){var m=p.value;m==s&&(l=!0)}}catch(b){f=!0,d=b}finally{try{u||null==h.return||h.return()}finally{if(f)throw d}}if(!l){var v=t+s;this.isFile(v)?e(v):this.isDir(v)&&this.eachFile(e,v+"/")}}}catch(b){a=!0,i=b}finally{try{n||null==o.return||o.return()}finally{if(a)throw i}}},writeFile:function(e,t){for(var n=e.split("/"),a="",i=0;i<n.length;i++)n[i]&&(a+="/"+n[i],i==n.length-1?this.api.FS.writeFile(a,t):this.isDir(a)||this.api.FS.mkdir(a))},saveFileToDB:function(){var e=this,n=0;return this.eachFile(function(a){if(t.saveFile.test(a.toLowerCase())){var i=e.api.FS.readFile(a).buffer;e.db.add(a,i),n++}}),new p.a(function(t,a){e.db.save.then(function(e){t(n)}).catch(function(e){a(e)})})},readFileFromDB:function(){var e=this,t=0;return this.db.eachFile(function(n,a){e.writeFile(n,new Uint8Array(a)),t++}),t},exportSaveFile:function(){var e={name:t.name,db:{}};this.db.eachFile(function(t,n){e.db[t]=Array.prototype.slice.call(new Uint8Array(n))});var n=new Blob([s()(e)]),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download=t.name+".json",a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a)},importSaveFile:function(e){var n=this,a=document.createElement("input");a.type="file",a.style.display="none",a.addEventListener("change",function(){if("application/json"!=a.files[0].type)e(-1);else{var i=new FileReader;i.onload=function(){var a;try{a=JSON.parse(i.result)}catch(s){return void e(-1)}if(a.name==t.name){for(var r in a.db=a.db||{},a.db)n.db.add(r,new Uint8Array(a.db[r]).buffer);n.db.save();var o=n.readFileFromDB();e(o)}else e(-2)},i.readAsText(a.files[0])}}),document.body.appendChild(a),a.click(),document.body.removeChild(a)}}),e.extract("".concat(x.baseUrl).concat(t.name,"/").concat(t.file)).then(function(){i.exec(["rescan"]).then(function(){i.db=new g(t.name),i.db.read().then(function(){i.exec([t.command]).then(function(){n(i)}).catch(function(e){a(e)})}).catch(function(e){a("database read error:"+e.toString())})})}).catch(function(e){a("extract file error:"+e.toString())})})})})},y={name:"app",data:function(){return{baseUrl:x.baseUrl,gameList:x.list,search:"",shownList:[],dos:null,runningGame:null}},methods:{fullGame:function(){this.$refs.main.requestFullscreen()},runGame:function(e){var t=this,n=this.$utils.showLoading();w(this.$refs.main,e).then(function(a){n.close(),t.dos=a,t.runningGame=e}).catch(function(e){n.close(),t.$utils.log(e),t.$message.error("加载失败")})},reloadGame:function(){this.dos&&(this.dos.exit(),this.runGame(this.runningGame))},saveDB:function(){var e=this,t=this.$utils.showLoading("保存中");this.dos&&this.dos.saveFileToDB().then(function(n){t.close(),e.$message.success("成功保存".concat(n,"个文件"))}).catch(function(n){e.$utils.log(n),t.close(),e.$message.error("保存时遇到问题")})},loadDB:function(){if(this.dos){var e=this.dos.readFileFromDB();this.$message.success("已加载".concat(e,"个文件"))}},exportDB:function(){this.dos&&this.dos.exportSaveFile()},importDB:function(){var e=this;this.dos&&this.dos.importSaveFile(function(t){t>=0?e.$message.success("成功导入".concat(t,"个文件")):-1==t?e.$message.error("文件格式有误"):-2==t&&e.$message.error("非该游戏存档")})}}},F=y,D=(n("5c0b"),n("8dec"),n("2877")),A=Object(D["a"])(F,i,r,!1,null,"f05e5ed4",null),E=A.exports,L=n("5c96"),P=n.n(L);n("0fae"),n("527d");a["default"].prototype.$utils={showLoading:function(e){return a["default"].prototype.$loading({lock:!0,text:e||"请稍候",background:"rgba(0,0,0,0.7)"})},log:function(e){console.log(e)}},a["default"].use(P.a),new a["default"]({el:"#app",render:function(e){return e(E)}})},"5c0b":function(e,t,n){"use strict";var a=n("5e27"),i=n.n(a);i.a},"5e27":function(e,t,n){},"821e":function(e,t,n){},"8dec":function(e,t,n){"use strict";var a=n("821e"),i=n.n(a);i.a},e5d3:function(e,t){e.exports="data:image/webp;base64,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"}});