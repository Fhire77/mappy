////
//// Gall.js
//// 

var g_Gall = {
	_YF : 1.70710678118654752440,
	_XF : 0.70710678118654752440,
	_RYF : 0.58578643762690495119,
	_RXF : 1.41421356237309504880,
	a : 6378137,
	D2R : 0.01745329251994329577,
	R2D : 57.29577951308232088,
   /**
        @constructs
        @private
    */
    initialize : function ()
    {
		var southWest = new g_Coordinates(-180, -90, false);
		var northEast = new g_Coordinates(180, 90, false);
		this.forwardGall(southWest);
		this.forwardGall(northEast);
		
		this.mMaxSize = northEast._x - southWest._x;
		
		this.mSourceAeraProOrigineX = southWest._x;
		this.mSourceAeraProOrigineY = southWest._y;
		
		this.mMaxHeightPct = (northEast._y - southWest._y) / this.mMaxSize;		
    },
    forwardGall : function (coords)
	{
		coords._x = this.a * this._XF * coords.x * this.D2R;
		coords._y = this.a * this._YF * Math.tan(0.5 * coords.y * this.D2R);
	},	
	normalize : function (coords)
	{
		coords._x = (coords._x - this.mSourceAeraProOrigineX)/ this.mMaxSize;
		coords._y = (coords._y - this.mSourceAeraProOrigineY) / this.mMaxSize;
	},	
	inverseGall : function (x, y)
	{
		var lat = this.R2D * this._RXF * x / this.a;
		var lon = this.R2D * 2. * Math.atan(y / this.a * this._RYF);
		return new g_Coordinates(lat, lon);
	},	
	forward : function(coords)
	{
		this.forwardGall(coords);
		this.normalize(coords);
	},	
	inverse : function (x, y)
	{	
		if (x < 0) x = 0;
		else if (x > 1) x = 1;
		
		if (y < 0) y = 0;
		else if (y > this.mMaxHeightPct) y = this.mMaxHeightPct;
		
		
		x *= this.mMaxSize; 
		y *= this.mMaxSize;
		
		x += this.mSourceAeraProOrigineX; 
		y += this.mSourceAeraProOrigineY;
		
		return this.inverseGall(x, y);
	}
};
