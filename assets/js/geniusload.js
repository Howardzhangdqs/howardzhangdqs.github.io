var geniusload = {
	loadTree: function(obj, ifroot = true, fathernode = 0) {
		if (ifroot) this.treeanalyze_adapter(obj), this.acknowledge_son();
		this.loaddfs(0);
	},
	
	nodenum: 0,
	
	treeanalyze_adapter: function(obj, father = 0) {
		if (typeof obj[0] == 'string') this.treeanalyze(obj, father);
		else for (let i in obj) this.treeanalyze(obj[i], father);
	},
	
	treeanalyze: function(obj, father) {
		let attrs = this.containsuffix(obj[0]);
		this.nodenum ++;
		this.nodetree.push({
			n:          this.nodenum,
			loading:    false,
			loaded:     false,
			type:       attrs.type,
			id:         attrs.id,
			class:      attrs.class,
			construct:  (attrs.type == 2 ? [obj[1], obj[2]] : obj[1]),
			beforeload: new Function(),
			afterload:  new Function(),
			childnode:  [],
			fathernode: father,
			starttime:  undefined,
			endtime:    undefined,
			lasttime:   undefined
		});
		let benchmark;
		if (attrs.type == 0 || attrs.type == 1) benchmark = 2;
		else if (attrs.type == 2) benchmark = 3;
		for (; benchmark < obj.length; benchmark ++) {
			if (typeof obj[benchmark] == 'function')
				this.tree_addattr(this.nodenum, {
					afterload: obj[benchmark]
				});
			if ((typeof obj[benchmark] == 'object') && (! Array.isArray(obj[benchmark]))) {
				this.tree_addattr(this.nodenum, obj[benchmark]);
			}
			if (Array.isArray(obj[benchmark])) {
				this.treeanalyze_adapter(obj[benchmark], this.nodenum);
			}
		}
	},
	
	acknowledge_son: function() {
		for (let i = 0; i < this.nodetree.length; i ++) {
			for (let j = 0; j < this.nodetree.length; j ++) {
				if (this.nodetree[i].fathernode == this.nodetree[j].n) {
					this.nodetree[j].childnode.push(i);
					break;
				}
			}
		}
	},
	
	tree_addattr: function(n, attrs) {
		for (let j in attrs) this.nodetree[n][j] = attrs[j];
	},
	
	loaddfs: function(fa) {
		if (fa != 0) {
			let pnode = this.nodetree[fa];
			
			if (pnode.type == 0) {
				let Script = document.createElement('script');
				if (pnode.id  != undefined) Script.setAttribute('id', pnode.id);
				if (pnode.cla != undefined) Script.setAttribute('class', pnode.cla);
				Script.setAttribute('src', pnode.construct);
				Script.setAttribute('type', 'text/javascript');
				
				(this.nodetree[fa].beforeload)();
				this.nodetree[fa].starttime = +new Date();
				document.body.appendChild(Script);
				
				this.nodetree[fa].DOM       = Script;
				this.nodetree[fa].outerHTML = Script.outerHTML;
				
				this.consolelog("S", this.nodetree[fa]);
				
				Script.onload = function() {
					geniusload.nodeafter((+new Date()), fa);
					geniusload.consolelog("E", geniusload.nodetree[fa]);
					(geniusload.nodetree[fa].afterload)();
					for (let i in geniusload.nodetree[fa].childnode)
						geniusload.loaddfs(geniusload.nodetree[fa].childnode[i]);
				}
			}
			
			if (pnode.type == 1) {
				let Script = document.createElement('link');
				if (pnode.id  != undefined) Script.setAttribute('id', pnode.id);
				if (pnode.cla != undefined) Script.setAttribute('class', pnode.cla);
				Script.setAttribute('href', pnode.construct);
				Script.setAttribute('rel', "stylesheet");
				
				(this.nodetree[fa].beforeload)();
				this.nodetree[fa].starttime = +new Date();
				document.head.appendChild(Script);
				
				this.nodetree[fa].DOM       = Script;
				this.nodetree[fa].outerHTML = Script.outerHTML;
				
				this.consolelog("S", this.nodetree[fa]);
				
				Script.onload = function() {
					geniusload.nodeafter((+new Date()), fa);
					geniusload.consolelog("E", geniusload.nodetree[fa]);
					(geniusload.nodetree[fa].afterload)();
					for (let i in geniusload.nodetree[fa].childnode)
						geniusload.loaddfs(geniusload.nodetree[fa].childnode[i]);
				}
			}
			
			if (pnode.type == 2) {
				let Script = document.createElement('style');
				if (pnode.id  != undefined) Script.setAttribute('id', pnode.id);
				if (pnode.cla != undefined) Script.setAttribute('class', pnode.cla);
				Script.innerHTML = "@font-face{font-family: '" + pnode.construct[0] + "';src: url(" + pnode.construct[1] + ");}";
				
				(this.nodetree[fa].beforeload)();
				this.nodetree[fa].starttime = +new Date();
				document.head.appendChild(Script);
				
				this.nodetree[fa].DOM       = Script;
				this.nodetree[fa].outerHTML = Script.outerHTML;
				
				this.consolelog("S", this.nodetree[fa]);
				
				Script.onload = function() {
					geniusload.nodeafter((+new Date()), fa);
					geniusload.consolelog("E", geniusload.nodetree[fa]);
					(geniusload.nodetree[fa].afterload)();
					for (let i in geniusload.nodetree[fa].childnode)
						geniusload.loaddfs(geniusload.nodetree[fa].childnode[i]);
				}
			}
		} else {
			for (let i in geniusload.nodetree[0].childnode)
				this.loaddfs(geniusload.nodetree[0].childnode[i]);
		}
		
	},
	
	nodetree: [{id: 0, childnode: [], n: 0}],
	
	nodeafter: function(pt, fa) {
		this.nodetree[fa].endtime  = pt;
		this.nodetree[fa].lasttime = pt - this.nodetree[fa].starttime;
		
		this.nodetree[fa].loading = false;
		this.nodetree[fa].loaded  = true;
	},
	
	containsuffix: function(str) {
		let id, cla, classt;
		suffix = (str.split("#")[0]).split(".")[0];
		cla = str.split(".")[1]; cla = (cla == undefined ? "" : cla).split(".")[0]; if (cla == "") cla = undefined;
		id  = str.split("#")[1]; id  = (id  == undefined ? "" : id ).split("#")[0]; if (id  == "") id  = undefined;
		
		let js   = ["js", "javascript", "script"];
		let css  = ["css", "Cascading Style Sheets", "style"];
		let font = ["font", "typeface", "family", "font-family"];
		suffix = suffix.toLowerCase();
		let type = 4;
		for (let i in js)   if (suffix == js[i])   type = 0;
		for (let i in css)  if (suffix == css[i])  type = 1;
		for (let i in font) if (suffix == font[i]) type = 2;
		return {type: type, id: id, class: cla};
	},
	
	consolelog: function(c, obj) {
		let clt;
		if (c == "E") {
			clt = obj.endtime;
			console.log("\x1B[38;2;0;217;61m[" + c + " " +
				("" + parseInt(clt / 1000 / 60 / 60) % 60).padStart(2, "0") + ":" +
				("" + parseInt(clt / 1000 / 60) % 60).padStart(2, "0") + ":" +
				("" + parseInt(clt / 1000) % 60).padStart(2, "0") + "." +
				("" + clt % 1000).padStart(3, "0") +
				" GeniusLoad]\x1B[39m " + obj.outerHTML +
				" \x1B[38;2;0;217;61mwhich loaded for " + obj.lasttime + " ms\x1B[39m");
			return;
		}
		clt = obj.starttime;
		console.log("\x1B[38;2;100;100;197m[" + c + " " +
			("" + parseInt(clt / 1000 / 60 / 60) % 60).padStart(2, "0") + ":" +
			("" + parseInt(clt / 1000 / 60) % 60).padStart(2, "0") + ":" +
			("" + parseInt(clt / 1000) % 60).padStart(2, "0") + "." +
			("" + clt % 1000).padStart(3, "0") +
			" GeniusLoad]\x1B[39m " + obj.outerHTML);
	}
}