////
//// GeoBounds.js
//// 

var g_GeoBounds = MappyApi.geo.GeoBounds = g_Class(/** @lends Mappy.api.geo.GeoBounds.prototype */{
    /**
        The north east point of the bounds.
        @type Mappy.api.geo.Coordinates
    */
    ne : null,
    /**
        The south west point of the bounds.
        @type Mappy.api.geo.Coordinates
    */
    sw : null,
    /**
        The center point of the bounds.
        @type Mappy.api.geo.Coordinates
    */
    center : null,
    /**
        @constructs
        @param {Mappy.api.geo.Coordinates} coord1
        @param {Mappy.api.geo.Coordinates} coord2
    */
    initialize : function (coord1, coord2)
    {
        if (!coord1 || !coord2)
            throw "Mappy.api.geo.GeoBounds needs 2 valid coordinates"
        
        var minX = Math.min(coord1.x, coord2.x);
        var minY = Math.min(coord1.y, coord2.y);
        var maxX = Math.max(coord1.x, coord2.x);
        var maxY = Math.max(coord1.y, coord2.y);
        
        this.ne = new g_Coordinates(maxX, maxY);
        this.sw = new g_Coordinates(minX, minY);
    },
    /**
    Set the "center" property corresponding to the current "ne" and "sw" properties.
    */
    getCenter : function ()
    {
        var x = this.sw._x + (this.ne._x - this.sw._x) / 2;
        var y = this.sw._y + (this.ne._y - this.sw._y) / 2;
        return g_Coordinates.fromNormalized(x, y);
    },
    /**
    Set the "center" property corresponding to the current "ne" and "sw" properties.
    @deprecated
    */
    refreshCenter : function ()
    {
        var x = this.sw._x + (this.ne._x - this.sw._x) / 2;
        var y = this.sw._y + (this.ne._y - this.sw._y) / 2;
        this.center = g_Coordinates.fromNormalized(x, y);
    },
	/**
	@param {Mappy.api.geo.Coordinates} c
	*/
	contains : function (c)
	{
		return c._x >= this.sw._x &&
			   c._x <= this.ne._x &&
			   c._y >= this.sw._y &&
			   c._y <= this.ne._y;
	},
    /**
    @param {Mappy.api.geo.GeoBounds} bounds
    @return {Mappy.api.geo.GeoBounds} Return the geobounds corresponding to the intersection of bounds parameter and this.
    */
    intersect : function (bounds)
    {
        var minX = Math.max(this.sw._x, bounds.sw._x);
        var minY = Math.max(this.sw._y, bounds.sw._y);
        var maxX = Math.min(this.ne._x, bounds.ne._x);
        var maxY = Math.min(this.ne._y, bounds.ne._y);

        if (maxX - minX < 0 || maxY - minY < 0)
        {
            return null;
        }
        else
        {
            var ne = g_Coordinates.fromNormalized(maxX, maxY);
            var sw = g_Coordinates.fromNormalized(minX, minY);
            return new g_GeoBounds(ne, sw);
        }
    },
    /**
    @param {Mappy.api.geo.Coordinates} c Extends the bounds with the given coordinates.
    */
    extend : function (c)
    {
        var ne = this.ne;
        var sw = this.sw;
        
        if (c._x < sw._x)
        {
            sw._x = c._x;
            sw.x = c.x;
        }
        if (c._x > ne._x)
        {
            ne._x = c._x;
            ne.x = c.x;
        }
        if (c._y < sw._y)
        {
            sw._y = c._y;
            sw.y = c.y;
        }
        if (c._y > ne._y)
        {
            ne._y = c._y;
            ne.y = c.y;
        }
    },
	getDeltaX : function ()
	{
		return this.ne._x - this.sw._x;
	},
	getDeltaY : function ()
	{
		return this.ne._y - this.sw._y;
	},
	toString : function ()
	{
		return this.ne.toString() + " / " + this.sw.toString();
	}
});



/**
 * Creates a GeoBounds instance from a list of locations (= a list of JSON objects having x and y values).
 */
var g_createGeoBoundsFromLocations = MappyApi.geo.createGeoBoundsFromLocations = function(locations)
{
	var neCoord = {};
	var swCoord = {};
	for(var i in locations)
	{
		var loc = locations[i];
		if(!neCoord.x || loc.x > neCoord.x)
		{
			neCoord.x = loc.x;
		}
		if(!neCoord.y || loc.y > neCoord.y)
		{
			neCoord.y = loc.y;
		}
		if(!swCoord.x || loc.x < swCoord.x)
		{
			swCoord.x = loc.x;
		}
		if(!swCoord.y || loc.y < swCoord.y)
		{
			swCoord.y = loc.y;
		}
	}
	var ne = new g_Coordinates(neCoord.x, neCoord.y);
	var sw = new g_Coordinates(swCoord.x, swCoord.y);
	return new g_GeoBounds(ne, sw);
};
