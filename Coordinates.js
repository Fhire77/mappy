////
//// Coordinates.js
//// 

var g_Coordinates = MappyApi.geo.Coordinates = g_Class(/** @lends Mappy.api.geo.Coordinates.prototype */{
    /**
    @constructs
	@param {Number} x Longitude
	@param {Number} y Latitude
	*/
	initialize : function (x, y)
	{   
		x = x - 0;
		y = y - 0;
		
		if (x > 180) this.x = 180;
		else if (x < -180) this.x = -180;
		else this.x = x;
		
		if (y > 90) this.y = 90;
		else if (y < -90) this.y = -90;
		else this.y = y;
		
		this.x = x - 0;
		this.y = y - 0;
		
		g_Gall.forward(this);
	},
    /**
	@return Return a new instance of Coordinates with the same values
	*/
    clone : function ()
    {
        var c = new g_Coordinates(this.x, this.y);
        c._x = this._x;
        c._y = this._y;
        return c;
    },
    /**
        @param {Mappy.api.geo.Coordinates} coords
        @return {Object} Returns an object with "dx" and "dy" parameters containing the distance between the two coordinates in meter for xaxis and yaxis
    */
    getDistance : function (coords)
    {
        var EARTH_RADIUS = 6378137,
            EARTH_RADIUS2 = 6356752.314;
        var dLonRad = (coords.x - this.x) * Math.PI / 180;
        var dLatRad = (coords.y - this.y) * Math.PI / 180;
        
        var yCenterRad  = (this.y + coords.y) / 2 * Math.PI / 180;
        
        var tan2y = Math.tan(yCenterRad);
        tan2y = tan2y * tan2y;
        
        return {
            dx : Math.abs(EARTH_RADIUS * EARTH_RADIUS * dLonRad / Math.sqrt(EARTH_RADIUS * EARTH_RADIUS  + EARTH_RADIUS2 * EARTH_RADIUS2 * tan2y)),
            dy : Math.abs(dLatRad * EARTH_RADIUS)
        };
    },
    /**
	@return Return a string representing this coordinate
	*/
	toString : function ()
	{
		return this.x + "," + this.y;
	}
});
