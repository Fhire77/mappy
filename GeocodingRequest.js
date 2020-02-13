////
//// GeocodingRequest.js
//// 

var g_GeocodingRequest = g_Class(g_LocRequest, /** @lends GeocodingRequest.prototype */{
    /**
        @constructs
        @augments LocRequest
        @private
    */
    initialize : function ()
    {
        g_LocRequest.prototype.initialize.call(this);
    },
    encode : function ()
    {
        var url = g_LocRequest.prototype.encode.apply(this);
        
        if (g_isDefined(this._addr._countryName))
        {
            url += "&countryName=" + this._addr._countryName;
        }
        if (g_isDefined(this._addr._townName))
        {
            url += "&townName=" + this._addr._townName;
        }
        if (g_isDefined(this._addr._number))
        {
            url += "&opt.number=" + this._addr._number;
        }
        if (g_isDefined(this._addr._wayName)) 
        {
            url += "&opt.wayName=" + this._addr._wayName;
        }
        if (g_isDefined(this._addr._countryCode))
        {
            url += "&countryCode=" + this._addr._countryCode;
        }
        if (g_isDefined(this._addr._townOfficialCode)) 
        {
            url += "&townOfficialCode=" + this._addr._townOfficialCode;
        }
        if (g_isDefined(this._addr._postalCode))
        {
            url += "&postalCode=" + this._addr._postalCode;
        }
        if (g_isDefined(this._addr._countryIsoCode)) 
        {
            url += "&countryIsoCode=" + this._addr._countryIsoCode;
        }
        if (g_isDefined(this._addr._subcountryName))
        {
            url += "&opt.subcountryName=" + this._addr._subcountryName;
        }
        if (g_isDefined(this._addr._subcountryOfficialCode)) 
        {
            url += "&opt.subcountryOfficialCode=" + this._addr._subcountryOfficialCode;
        }
     
        return url;
    },
    configure : function (addr, options)
    {
        g_LocRequest.prototype.configure.call(this, options);
        this._addr = addr;
    },
    isReady : function ()
    {
        return (g_isDefined(this._addr._countryName) || g_isDefined(this._addr._countryCode));
    }
});
