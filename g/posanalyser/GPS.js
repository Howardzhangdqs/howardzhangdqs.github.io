var GPS = {
    PI: 3.14159265358979324, x_pi: 3.14159265358979324 * 3000.0 / 180.0,
	
	MODE_LIST: [
		"Clarke 1866", "Clarke 1880",
		"Bessel 1841",
		"International 1924",
		"Krasovsky 1940",
		"International 1975",
		"GRS 1980",
		"WGS 1984",
		"Sphere" // 不推荐使用
	],
	MODE_: "WGS 1984",
	
	PFData: [6378206.4, 6378245.0, 6377397.155, 6378388.0, 6378245.0, 6378140.0, 6378137.0, 6378137.0, 6371000.0],
	ROData: [294.9786982, 293.46, 299.1528434, 296.9993621, 298.2997381, 298.257, 298.257222101, 298.257223563],
	
	set MODE(s) {
		this.MODE_ = s;
		for (let i in this.MODE_LIST) if (s == this.MODE_LIST[i]) {
			this.Projection_factor = this.PFData[i];
			
			if (i == 8) this.Eccentricity = 0; // 特判 Sphere Mode
			else {
				let t = (this.Projection_factor * (1 - 1 / this.ROData[i]));
				let t2 = this.Projection_factor * this.Projection_factor
				this.Eccentricity = (t2 - t * t) / (t2);
			}
			return;
		}
		this.Projection_factor = 6378137.0;
		this.Eccentricity      = 0.0066943799013;
	},
	
	// 卫星椭球坐标投影到平面地图坐标系的投影因子
	Projection_factor: 6378137.0,
	
	// 椭球的偏心率
	Eccentricity: 0.0066943799013,
	
    delta: function (lat, lon) {
        var a = this.Projection_factor;
        var ee = this.Eccentricity;
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },

    //WGS-84 转 GCJ-02
    gcj_encrypt: function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon)) return {'lat': wgsLat, 'lon': wgsLon};
        var d = this.delta(wgsLat, wgsLon);
		//console.log({'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon});
        return {'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon};
    },
	
    //GCJ-02 转 WGS-84
    gcj_decrypt: function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon)) return {'lat': gcjLat, 'lon': gcjLon};

        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },
	
    //GCJ-02 转 WGS-84 exactly
    gcj_decrypt_exact: function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) break;

            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

            if (++i > 10000) break;
        }
        //console.log(i);
        return {'lat': wgsLat, 'lon': wgsLon};
    },
	
    //GCJ-02 转 BD-09
    bd_encrypt: function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
        bdLon = z * Math.cos(theta) + 0.0065;
        bdLat = z * Math.sin(theta) + 0.006;
        return {'lat': bdLat,'lon': bdLon};
    },
	
    //BD-09 转 GCJ-02
    bd_decrypt: function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gcjLon = z * Math.cos(theta);
        var gcjLat = z * Math.sin(theta);
        return {'lat': gcjLat, 'lon': gcjLon};
    },
	
    //WGS-84 转 Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt: function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat': y, 'lon': x};
    },
	
    // Web mercator 转 WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt: function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat': y, 'lon': x};
    },
	
    // two point's distance
    distance: function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
	
    outOfChina: function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
	
    transformLat: function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
	
    transformLon: function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};