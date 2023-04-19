import"./modulepreload-polyfill-3cfb730f.js";var ot=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},L={},it={get exports(){return L},set exports(d){L=d}},N={},ut={get exports(){return N},set exports(d){N=d}};(function(){var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",S={rotl:function(c,y){return c<<y|c>>>32-y},rotr:function(c,y){return c<<32-y|c>>>y},endian:function(c){if(c.constructor==Number)return S.rotl(c,8)&16711935|S.rotl(c,24)&4278255360;for(var y=0;y<c.length;y++)c[y]=S.endian(c[y]);return c},randomBytes:function(c){for(var y=[];c>0;c--)y.push(Math.floor(Math.random()*256));return y},bytesToWords:function(c){for(var y=[],f=0,u=0;f<c.length;f++,u+=8)y[u>>>5]|=c[f]<<24-u%32;return y},wordsToBytes:function(c){for(var y=[],f=0;f<c.length*32;f+=8)y.push(c[f>>>5]>>>24-f%32&255);return y},bytesToHex:function(c){for(var y=[],f=0;f<c.length;f++)y.push((c[f]>>>4).toString(16)),y.push((c[f]&15).toString(16));return y.join("")},hexToBytes:function(c){for(var y=[],f=0;f<c.length;f+=2)y.push(parseInt(c.substr(f,2),16));return y},bytesToBase64:function(c){for(var y=[],f=0;f<c.length;f+=3)for(var u=c[f]<<16|c[f+1]<<8|c[f+2],a=0;a<4;a++)f*8+a*6<=c.length*8?y.push(d.charAt(u>>>6*(3-a)&63)):y.push("=");return y.join("")},base64ToBytes:function(c){c=c.replace(/[^A-Z0-9+\/]/ig,"");for(var y=[],f=0,u=0;f<c.length;u=++f%4)u!=0&&y.push((d.indexOf(c.charAt(f-1))&Math.pow(2,-2*u+8)-1)<<u*2|d.indexOf(c.charAt(f))>>>6-u*2);return y}};ut.exports=S})();var P={utf8:{stringToBytes:function(d){return P.bin.stringToBytes(unescape(encodeURIComponent(d)))},bytesToString:function(d){return decodeURIComponent(escape(P.bin.bytesToString(d)))}},bin:{stringToBytes:function(d){for(var S=[],c=0;c<d.length;c++)S.push(d.charCodeAt(c)&255);return S},bytesToString:function(d){for(var S=[],c=0;c<d.length;c++)S.push(String.fromCharCode(d[c]));return S.join("")}}},U=P;/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var ct=function(d){return d!=null&&(z(d)||at(d)||!!d._isBuffer)};function z(d){return!!d.constructor&&typeof d.constructor.isBuffer=="function"&&d.constructor.isBuffer(d)}function at(d){return typeof d.readFloatLE=="function"&&typeof d.slice=="function"&&z(d.slice(0,0))}(function(){var d=N,S=U.utf8,c=ct,y=U.bin,f=function(u,a){u.constructor==String?a&&a.encoding==="binary"?u=y.stringToBytes(u):u=S.stringToBytes(u):c(u)?u=Array.prototype.slice.call(u,0):!Array.isArray(u)&&u.constructor!==Uint8Array&&(u=u.toString());for(var t=d.bytesToWords(u),p=u.length*8,n=1732584193,e=-271733879,o=-1732584194,r=271733878,i=0;i<t.length;i++)t[i]=(t[i]<<8|t[i]>>>24)&16711935|(t[i]<<24|t[i]>>>8)&4278255360;t[p>>>5]|=128<<p%32,t[(p+64>>>9<<4)+14]=p;for(var h=f._ff,_=f._gg,v=f._hh,x=f._ii,i=0;i<t.length;i+=16){var F=n,R=e,A=o,w=r;n=h(n,e,o,r,t[i+0],7,-680876936),r=h(r,n,e,o,t[i+1],12,-389564586),o=h(o,r,n,e,t[i+2],17,606105819),e=h(e,o,r,n,t[i+3],22,-1044525330),n=h(n,e,o,r,t[i+4],7,-176418897),r=h(r,n,e,o,t[i+5],12,1200080426),o=h(o,r,n,e,t[i+6],17,-1473231341),e=h(e,o,r,n,t[i+7],22,-45705983),n=h(n,e,o,r,t[i+8],7,1770035416),r=h(r,n,e,o,t[i+9],12,-1958414417),o=h(o,r,n,e,t[i+10],17,-42063),e=h(e,o,r,n,t[i+11],22,-1990404162),n=h(n,e,o,r,t[i+12],7,1804603682),r=h(r,n,e,o,t[i+13],12,-40341101),o=h(o,r,n,e,t[i+14],17,-1502002290),e=h(e,o,r,n,t[i+15],22,1236535329),n=_(n,e,o,r,t[i+1],5,-165796510),r=_(r,n,e,o,t[i+6],9,-1069501632),o=_(o,r,n,e,t[i+11],14,643717713),e=_(e,o,r,n,t[i+0],20,-373897302),n=_(n,e,o,r,t[i+5],5,-701558691),r=_(r,n,e,o,t[i+10],9,38016083),o=_(o,r,n,e,t[i+15],14,-660478335),e=_(e,o,r,n,t[i+4],20,-405537848),n=_(n,e,o,r,t[i+9],5,568446438),r=_(r,n,e,o,t[i+14],9,-1019803690),o=_(o,r,n,e,t[i+3],14,-187363961),e=_(e,o,r,n,t[i+8],20,1163531501),n=_(n,e,o,r,t[i+13],5,-1444681467),r=_(r,n,e,o,t[i+2],9,-51403784),o=_(o,r,n,e,t[i+7],14,1735328473),e=_(e,o,r,n,t[i+12],20,-1926607734),n=v(n,e,o,r,t[i+5],4,-378558),r=v(r,n,e,o,t[i+8],11,-2022574463),o=v(o,r,n,e,t[i+11],16,1839030562),e=v(e,o,r,n,t[i+14],23,-35309556),n=v(n,e,o,r,t[i+1],4,-1530992060),r=v(r,n,e,o,t[i+4],11,1272893353),o=v(o,r,n,e,t[i+7],16,-155497632),e=v(e,o,r,n,t[i+10],23,-1094730640),n=v(n,e,o,r,t[i+13],4,681279174),r=v(r,n,e,o,t[i+0],11,-358537222),o=v(o,r,n,e,t[i+3],16,-722521979),e=v(e,o,r,n,t[i+6],23,76029189),n=v(n,e,o,r,t[i+9],4,-640364487),r=v(r,n,e,o,t[i+12],11,-421815835),o=v(o,r,n,e,t[i+15],16,530742520),e=v(e,o,r,n,t[i+2],23,-995338651),n=x(n,e,o,r,t[i+0],6,-198630844),r=x(r,n,e,o,t[i+7],10,1126891415),o=x(o,r,n,e,t[i+14],15,-1416354905),e=x(e,o,r,n,t[i+5],21,-57434055),n=x(n,e,o,r,t[i+12],6,1700485571),r=x(r,n,e,o,t[i+3],10,-1894986606),o=x(o,r,n,e,t[i+10],15,-1051523),e=x(e,o,r,n,t[i+1],21,-2054922799),n=x(n,e,o,r,t[i+8],6,1873313359),r=x(r,n,e,o,t[i+15],10,-30611744),o=x(o,r,n,e,t[i+6],15,-1560198380),e=x(e,o,r,n,t[i+13],21,1309151649),n=x(n,e,o,r,t[i+4],6,-145523070),r=x(r,n,e,o,t[i+11],10,-1120210379),o=x(o,r,n,e,t[i+2],15,718787259),e=x(e,o,r,n,t[i+9],21,-343485551),n=n+F>>>0,e=e+R>>>0,o=o+A>>>0,r=r+w>>>0}return d.endian([n,e,o,r])};f._ff=function(u,a,t,p,n,e,o){var r=u+(a&t|~a&p)+(n>>>0)+o;return(r<<e|r>>>32-e)+a},f._gg=function(u,a,t,p,n,e,o){var r=u+(a&p|t&~p)+(n>>>0)+o;return(r<<e|r>>>32-e)+a},f._hh=function(u,a,t,p,n,e,o){var r=u+(a^t^p)+(n>>>0)+o;return(r<<e|r>>>32-e)+a},f._ii=function(u,a,t,p,n,e,o){var r=u+(t^(a|~p))+(n>>>0)+o;return(r<<e|r>>>32-e)+a},f._blocksize=16,f._digestsize=16,it.exports=function(u,a){if(u==null)throw new Error("Illegal argument "+u);var t=d.wordsToBytes(f(u,a));return a&&a.asBytes?t:a&&a.asString?y.bytesToString(t):d.bytesToHex(t)}})();const j=50,ft=10,G=12,st=new RegExp(`(.{${Math.floor(j/G)}})`,"g"),Y="PpgfJ8EIYQ2hC7MSVu4r91HdLBlza0Rocn3Z6iqeKkFDW5NOtmsTwXGxUyAbjv",lt=Y.length,W=`_@;:!<[%{(*+.})"-#$^=]>',&`,dt=W.length,pt=d=>{let S=L(d),c=S;for(;c.length<j;)S=L(S),c+=S;return c},yt=d=>{const c=pt(d).replace(st,"$1 ").trim().split(" ").splice(0,G);return console.log("chunks:",c),c.forEach((y,f)=>c[f]=f>=ft?W[parseInt(y,16)%dt]:Y[parseInt(y,16)%lt]),c.join("")};var k={},ht={get exports(){return k},set exports(d){k=d}};/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */(function(d,S){(function(y,f){d.exports=f()})(ot,function(){return function(){var c={686:function(u,a,t){t.d(a,{default:function(){return rt}});var p=t(279),n=t.n(p),e=t(370),o=t.n(e),r=t(817),i=t.n(r);function h(b){try{return document.execCommand(b)}catch{return!1}}var _=function(l){var s=i()(l);return h("cut"),s},v=_;function x(b){var l=document.documentElement.getAttribute("dir")==="rtl",s=document.createElement("textarea");s.style.fontSize="12pt",s.style.border="0",s.style.padding="0",s.style.margin="0",s.style.position="absolute",s.style[l?"right":"left"]="-9999px";var g=window.pageYOffset||document.documentElement.scrollTop;return s.style.top="".concat(g,"px"),s.setAttribute("readonly",""),s.value=b,s}var F=function(l,s){var g=x(l);s.container.appendChild(g);var m=i()(g);return h("copy"),g.remove(),m},R=function(l){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{container:document.body},g="";return typeof l=="string"?g=F(l,s):l instanceof HTMLInputElement&&!["text","search","url","tel","password"].includes(l==null?void 0:l.type)?g=F(l.value,s):(g=i()(l),h("copy")),g},A=R;function w(b){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?w=function(s){return typeof s}:w=function(s){return s&&typeof Symbol=="function"&&s.constructor===Symbol&&s!==Symbol.prototype?"symbol":typeof s},w(b)}var V=function(){var l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},s=l.action,g=s===void 0?"copy":s,m=l.container,T=l.target,E=l.text;if(g!=="copy"&&g!=="cut")throw new Error('Invalid "action" value, use either "copy" or "cut"');if(T!==void 0)if(T&&w(T)==="object"&&T.nodeType===1){if(g==="copy"&&T.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if(g==="cut"&&(T.hasAttribute("readonly")||T.hasAttribute("disabled")))throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`)}else throw new Error('Invalid "target" value, use a valid Element');if(E)return A(E,{container:m});if(T)return g==="cut"?v(T):A(T,{container:m})},X=V;function C(b){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?C=function(s){return typeof s}:C=function(s){return s&&typeof Symbol=="function"&&s.constructor===Symbol&&s!==Symbol.prototype?"symbol":typeof s},C(b)}function Z(b,l){if(!(b instanceof l))throw new TypeError("Cannot call a class as a function")}function D(b,l){for(var s=0;s<l.length;s++){var g=l[s];g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(b,g.key,g)}}function J(b,l,s){return l&&D(b.prototype,l),s&&D(b,s),b}function K(b,l){if(typeof l!="function"&&l!==null)throw new TypeError("Super expression must either be null or a function");b.prototype=Object.create(l&&l.prototype,{constructor:{value:b,writable:!0,configurable:!0}}),l&&M(b,l)}function M(b,l){return M=Object.setPrototypeOf||function(g,m){return g.__proto__=m,g},M(b,l)}function Q(b){var l=et();return function(){var g=O(b),m;if(l){var T=O(this).constructor;m=Reflect.construct(g,arguments,T)}else m=g.apply(this,arguments);return q(this,m)}}function q(b,l){return l&&(C(l)==="object"||typeof l=="function")?l:tt(b)}function tt(b){if(b===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return b}function et(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function O(b){return O=Object.setPrototypeOf?Object.getPrototypeOf:function(s){return s.__proto__||Object.getPrototypeOf(s)},O(b)}function I(b,l){var s="data-clipboard-".concat(b);if(l.hasAttribute(s))return l.getAttribute(s)}var nt=function(b){K(s,b);var l=Q(s);function s(g,m){var T;return Z(this,s),T=l.call(this),T.resolveOptions(m),T.listenClick(g),T}return J(s,[{key:"resolveOptions",value:function(){var m=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};this.action=typeof m.action=="function"?m.action:this.defaultAction,this.target=typeof m.target=="function"?m.target:this.defaultTarget,this.text=typeof m.text=="function"?m.text:this.defaultText,this.container=C(m.container)==="object"?m.container:document.body}},{key:"listenClick",value:function(m){var T=this;this.listener=o()(m,"click",function(E){return T.onClick(E)})}},{key:"onClick",value:function(m){var T=m.delegateTarget||m.currentTarget,E=this.action(T)||"copy",B=X({action:E,container:this.container,target:this.target(T),text:this.text(T)});this.emit(B?"success":"error",{action:E,text:B,trigger:T,clearSelection:function(){T&&T.focus(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(m){return I("action",m)}},{key:"defaultTarget",value:function(m){var T=I("target",m);if(T)return document.querySelector(T)}},{key:"defaultText",value:function(m){return I("text",m)}},{key:"destroy",value:function(){this.listener.destroy()}}],[{key:"copy",value:function(m){var T=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{container:document.body};return A(m,T)}},{key:"cut",value:function(m){return v(m)}},{key:"isSupported",value:function(){var m=arguments.length>0&&arguments[0]!==void 0?arguments[0]:["copy","cut"],T=typeof m=="string"?[m]:m,E=!!document.queryCommandSupported;return T.forEach(function(B){E=E&&!!document.queryCommandSupported(B)}),E}}]),s}(n()),rt=nt},828:function(u){var a=9;if(typeof Element<"u"&&!Element.prototype.matches){var t=Element.prototype;t.matches=t.matchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector||t.webkitMatchesSelector}function p(n,e){for(;n&&n.nodeType!==a;){if(typeof n.matches=="function"&&n.matches(e))return n;n=n.parentNode}}u.exports=p},438:function(u,a,t){var p=t(828);function n(r,i,h,_,v){var x=o.apply(this,arguments);return r.addEventListener(h,x,v),{destroy:function(){r.removeEventListener(h,x,v)}}}function e(r,i,h,_,v){return typeof r.addEventListener=="function"?n.apply(null,arguments):typeof h=="function"?n.bind(null,document).apply(null,arguments):(typeof r=="string"&&(r=document.querySelectorAll(r)),Array.prototype.map.call(r,function(x){return n(x,i,h,_,v)}))}function o(r,i,h,_){return function(v){v.delegateTarget=p(v.target,i),v.delegateTarget&&_.call(r,v)}}u.exports=e},879:function(u,a){a.node=function(t){return t!==void 0&&t instanceof HTMLElement&&t.nodeType===1},a.nodeList=function(t){var p=Object.prototype.toString.call(t);return t!==void 0&&(p==="[object NodeList]"||p==="[object HTMLCollection]")&&"length"in t&&(t.length===0||a.node(t[0]))},a.string=function(t){return typeof t=="string"||t instanceof String},a.fn=function(t){var p=Object.prototype.toString.call(t);return p==="[object Function]"}},370:function(u,a,t){var p=t(879),n=t(438);function e(h,_,v){if(!h&&!_&&!v)throw new Error("Missing required arguments");if(!p.string(_))throw new TypeError("Second argument must be a String");if(!p.fn(v))throw new TypeError("Third argument must be a Function");if(p.node(h))return o(h,_,v);if(p.nodeList(h))return r(h,_,v);if(p.string(h))return i(h,_,v);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function o(h,_,v){return h.addEventListener(_,v),{destroy:function(){h.removeEventListener(_,v)}}}function r(h,_,v){return Array.prototype.forEach.call(h,function(x){x.addEventListener(_,v)}),{destroy:function(){Array.prototype.forEach.call(h,function(x){x.removeEventListener(_,v)})}}}function i(h,_,v){return n(document.body,h,_,v)}u.exports=e},817:function(u){function a(t){var p;if(t.nodeName==="SELECT")t.focus(),p=t.value;else if(t.nodeName==="INPUT"||t.nodeName==="TEXTAREA"){var n=t.hasAttribute("readonly");n||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),n||t.removeAttribute("readonly"),p=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var e=window.getSelection(),o=document.createRange();o.selectNodeContents(t),e.removeAllRanges(),e.addRange(o),p=e.toString()}return p}u.exports=a},279:function(u){function a(){}a.prototype={on:function(t,p,n){var e=this.e||(this.e={});return(e[t]||(e[t]=[])).push({fn:p,ctx:n}),this},once:function(t,p,n){var e=this;function o(){e.off(t,o),p.apply(n,arguments)}return o._=p,this.on(t,o,n)},emit:function(t){var p=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),e=0,o=n.length;for(e;e<o;e++)n[e].fn.apply(n[e].ctx,p);return this},off:function(t,p){var n=this.e||(this.e={}),e=n[t],o=[];if(e&&p)for(var r=0,i=e.length;r<i;r++)e[r].fn!==p&&e[r].fn._!==p&&o.push(e[r]);return o.length?n[t]=o:delete n[t],this}},u.exports=a,u.exports.TinyEmitter=a}},y={};function f(u){if(y[u])return y[u].exports;var a=y[u]={exports:{}};return c[u](a,a.exports,f),a.exports}return function(){f.n=function(u){var a=u&&u.__esModule?function(){return u.default}:function(){return u};return f.d(a,{a}),a}}(),function(){f.d=function(u,a){for(var t in a)f.o(a,t)&&!f.o(u,t)&&Object.defineProperty(u,t,{enumerable:!0,get:a[t]})}}(),function(){f.o=function(u,a){return Object.prototype.hasOwnProperty.call(u,a)}}(),f(686)}().default})})(ht);const $=document.getElementById("key"),H=document.getElementById("password");H.innerText="加载完毕";$.addEventListener("change",()=>{const d=yt($.value);H.innerText="rsy傻逼",k.copy(d),setTimeout(()=>{k.copy("傻逼"),H.innerText="rsy大傻逼"},2e3)});