import"./modulepreload-polyfill-3cfb730f.js";import{j as R,k as C,c as S,w as n,r as l,o as x,a,e as m,b as F,d as L,F as N,u as O,t as V,_ as W,f as q,g as G,h as H,i as J}from"./materialdesignicons-667f39e5.js";var $=function(f){this.opt=f||{},this.favicon=this.opt.favicon||"/favicon.ico",this.timeout=this.opt.timeout||0,this.logError=this.opt.logError||!1};$.prototype.ping=function(f){var _,g,r;typeof Promise<"u"&&(_=new Promise(function(s,b){g=s,r=b}));var o=this;o.wasSuccess=!1,o.img=new Image,o.img.onload=h,o.img.onerror=v;var p,e=new Date;function h(s){o.wasSuccess=!0,d.call(o,s)}function v(s){o.wasSuccess=!1,d.call(o,s)}o.timeout&&(p=setTimeout(function(){d.call(o,void 0)},o.timeout));function d(){p&&clearTimeout(p);var s=new Date-e;if(_)return this.wasSuccess?g(s):r(s);throw new Error("Promise is not supported by your browser. Use callback instead.")}return o.img.src=f+o.favicon+"?"+ +new Date,_};const K=R({__name:"App",setup(f){const _=window,g=2e4,r=new URL(window.location.href),o=C(decodeURI(r.searchParams.get("wd")||""));console.log(r);const p=/(https?:\/\/)?(([0-9a-z.-]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_]*)?(\?[0-9a-z=&%_-]*)?(#[0-9a-z=&%_-]*)?/ig,e=C([]);let h=0,v=0;const d=["未Ping","Ping中","Ping成功","Ping超时"],s=()=>{let t;e.value=[];let i=[];for(;(t=p.exec(o.value))!==null;){let c=(t[1]?t[1]:"//")+t[2];e.value.push({url:c,status:0,time:-1}),i.push(c)}history.pushState({},"",`${r.origin}${r.pathname}?${o.value?`wd=${encodeURI(i.join(`
`))}`:""}`),h=e.value.length};s();const b=()=>{for(let t in e.value){let i=new $;e.value[t].status=1,i.ping(e.value[t].url).then(c=>{console.log(e.value[t].url,c),e.value[t].status=2,e.value[t].time=c,v++}).catch(c=>{console.log(e.value[t].url,c),e.value[t].status=c<g?2:3,e.value[t].time=c,v++,z()})}},z=()=>{v==h&&e.value.sort((t,i)=>t.status-i.status)},T=()=>{for(let t in e.value)e.value[t].status=0,e.value[t].time=-1};return(t,i)=>{const c=l("v-app-bar-nav-icon"),U=l("v-toolbar-title"),j=l("v-app-bar"),A=l("v-textarea"),k=l("v-btn"),w=l("v-col"),y=l("v-row"),P=l("v-container"),B=l("v-card-text"),D=l("v-card"),E=l("v-main"),I=l("v-app");return x(),S(I,{id:"inspire"},{default:n(()=>[a(j,{app:""},{default:n(()=>[a(c),a(U,null,{default:n(()=>[m("Ping工具")]),_:1})]),_:1}),a(E,null,{default:n(()=>[a(P,null,{default:n(()=>[a(A,{label:"请输入链接们",clearable:"","auto-grow":"",onBlur:s,modelValue:o.value,"onUpdate:modelValue":i[0]||(i[0]=u=>o.value=u)},null,8,["modelValue"]),a(P,null,{default:n(()=>[a(y,{justify:"center"},{default:n(()=>[a(w,{cols:"auto"},{default:n(()=>[a(k,{variant:"outlined",color:"green",onClick:b},{default:n(()=>[m("开始Ping")]),_:1})]),_:1}),a(w,{cols:"auto"},{default:n(()=>[a(k,{variant:"outlined",onClick:T},{default:n(()=>[m("清空结果")]),_:1})]),_:1}),a(w,{cols:"auto"},{default:n(()=>[a(k,{variant:"outlined",color:"red"},{default:n(()=>[m("结束")]),_:1})]),_:1})]),_:1})]),_:1}),a(y,null,{default:n(()=>[(x(!0),F(N,null,L(e.value,u=>(x(),S(w,{key:u,cols:"12",sm:"4"},{default:n(()=>[a(D,{title:u.url,class:"v-card-center",color:u.status==2?"#060":u.status==3?"#600":"",onClick:X=>O(_).open(u.url,"_blank")},{default:n(()=>[a(B,null,{default:n(()=>[m(V(d[u.status])+" "+V(u.time>=0?`${u.time}ms`:"")+" ",1)]),_:2},1024)]),_:2},1032,["title","color","onClick"])]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})}}});const M=W(K,[["__scopeId","data-v-7c7f482b"]]),Q=q({components:H,directives:J,theme:{defaultTheme:"dark"},icons:{defaultSet:"mdi"}});G(M).use(Q).mount("#app");