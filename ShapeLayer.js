////
//// ShapeLayer.js
//// 

var g_ShapeLayer = MappyApi.map.layer.ShapeLayer = g_Class(g_Layer, /** @lends Mappy.api.map.layer.ShapeLayer.prototype */{
    _shapes : null,
    _movedFromLastRefresh : null,
    /**
        @constructs
        @augments Layer
        @param {Number} zindex
    */
    initialize : function (zindex, options)
    {
        zindex = zindex || 50;
        g_Layer.prototype.initialize.call(this, 'shapeLayer', zindex, options);
        this._shapes = [];
        this._movedFromLastRefresh = new g_Point(0, 0);
    },
    /**
        @private
    */
    added : function (controller)
    {
        g_Layer.prototype.added.call(this, controller);

		// Adding listeners
		var map = controller.map;
		map.addListener("zoomstart", g_makeCaller(this._zoomStartHandler, this));
        map.addListener("zoomend", g_makeCaller(this._zoomEndHandler, this));
        map.addListener("changeend", g_makeCaller(this._redrawShapes, this));
        map.addListener("dragstart", g_makeCaller(this._dragStartHandler, this));
        map.addListener("drag", g_makeCaller(this._dragHandler, this));
        map.addListener("mousemove", g_makeCaller(this._mouseMoveHandler, this));
        map.addListener("mouseout", g_makeCaller(this._mouseOutHandler, this));
        map.addListener("mousedown", g_makeCaller(this._mouseDownHandler, this));
        map.addListener("mouseup", g_makeCaller(this._mouseUpHandler, this));
		
		// Add existing shapes
		this._addShapes();

    },
    /**
        @private
    */
    newDisplayArea : function ()
    {
        for (var i = 0; i < this._shapes.length; i += 1)
        {
            this._shapes[i].calcPoints();
        }
        this._redrawShapes();
    },
    /**
        @private
    */
    _zoomStartHandler : function ()
    {
        this.div.hide();
    },
    /**
        @private
    */
    _zoomEndHandler : function ()
    {
        if (this.isHidden === false)
        {
            this.div.show();
        }
    },
    /**
        @private
    */
    _mouseMoveHandler : function (event)
	{
		var shapes = this._shapes;
		if (this._controller.map.dragging === false)
		{
			for (var i = 0; i < shapes.length; i += 1)
			{
				var shape = shapes[i];
				if (shape.hasListeners)
				{
					if (shape.isOver)
					{
						if (shape.isInShape(event) === false)
						{
							shape.isOver = false;
							shape.trigger("mouseout", event);
						}
					}
					else
					{
						if (shape.isInShape(event))
						{
							shape.isOver = true;
							shape.trigger("mouseover", event);
						}
					}
				}
			}
		}
	},
    /**
        @private
    */
    _mouseOutHandler : function (event)
	{
		for (var i = 0; i < this._shapes.length; i += 1)
		{
			if (this._shapes[i].isOver)
			{
				this._shapes[i].isOver = false;
				this._shapes[i].trigger("mouseout", event);
			}
		}
	},
    /**
        @private
    */
    _mouseDownHandler : function (event)
	{
		for (var i = 0; i < this._shapes.length; i += 1)
		{
			if (this._shapes[i].isInShape(event))
			{
				this._shapes[i].trigger("mousedown", event);
			}
		}
		g_preventDefault(event);
	},
    /**
        @private
    */
    _mouseUpHandler : function (event)
	{
		for (var i = 0; i <  this._shapes.length; i += 1)
		{
			if ( this._shapes[i].isInShape(event))
			{
				 this._shapes[i].trigger("mouseup", event);
			}
		}
	},
    /**
        @private
    */
    _dragStartHandler : function (event)
	{
		this._startEvent = event;
	},
    /**
        @private
    */
    _dragHandler : function (event)
	{
		var startEvent = this._startEvent;
		if (startEvent !== null)
		{
			this._movedFromLastRefresh.x += startEvent.pageX - event.pageX;
			this._movedFromLastRefresh.y += startEvent.pageY - event.pageY;
			if (Math.abs(this._movedFromLastRefresh.x) > 500 ||
				Math.abs(this._movedFromLastRefresh.y) > 500)
			{
				this._redrawShapes();
			}
			this._startEvent = event;
		}
    },
    /**
        @private
    */
    _calcViewBox : function ()
    {
        var mapSize = this._controller.model.getSize();
        var converter = this._controller.converter;

		var ne = converter.fromPixels(mapSize.width + 500, - 500);
        var sw = converter.fromPixels(- 500, mapSize.height + 500);
		
        if (ne._x > 1 ||
            ne._y < 0 ||
            sw._x > 1 ||
            sw._y < 0 ||
            ne._x < sw._x)
        {
            ne = new g_Coordinates(180, 90);
            sw = new g_Coordinates(-180, -90);
        }
        this.viewBox = new g_GeoBounds(ne, sw);
    },
    /**
        @private
    */
    _redrawShapes : function (from)
    {
        if (from !== "drag")
        {
            this._calcViewBox();

            for (var i = 0; i < this._shapes.length; i += 1)
            {
                this._shapes[i].draw(this.viewBox);
            }
            this._movedFromLastRefresh = new g_Point(0, 0);
        }
    },
    /**
        @private
    */
    _addShapes : function ()
    {
        for (var i = 0; i < this._shapes.length; i += 1)
        {
            if (this._shapes[i].isOnMap === false)
            {
                this._shapes[i].added(this.div, this._controller);
            }
        }
        if (this._controller.map.isReady)
        {
            this.newDisplayArea();
        }
    },
    /**
		@param {Shape} shape Add a shape on the layer.
    */
    addShape : function (shape)
    {
        if (g_jQuery.inArray(shape, this._shapes) === -1)
        {
            if (this.isOnMap)
            {
                shape.added(this.div, this._controller);
                if (this._controller.map.isReady)
                {
                    shape.calcPoints();
                    shape.draw(this.viewBox);
                }
            }
            this._shapes.push(shape);
        }
    },
    /**
		@param {Shape} shape Remove a shape from the layer.
    */
    removeShape : function (shape)
    {
        var i = g_jQuery.inArray(shape, this._shapes);
        if (i !== -1)
        {
            this._shapes[i].removed();
            this._shapes.splice(i, 1);
            return true;
        }
        else
        {
            return false;
        }
    },
    /**
		Remove all shapes from the layer.
    */
    clean : function ()
    {
        while (this._shapes.length > 0)
        {
            this.removeShape(this._shapes[0]);
        }
        g_Layer.prototype.clean.call(this);
    },
    /**
		@return {Mappy.api.geo.GeoBounds} Returns the general bounds of the layer.
    */
    getBounds : function ()
    {
        if (this._shapes.length > 0)
        {
            var geoBounds;
            for (var i = 0; i < this._shapes.length; i += 1)
            {
                var shapeBounds = this._shapes[i].getBounds();
                if (g_isDefined(shapeBounds))
                {
                    if (g_isNotDefined(geoBounds))
                    {
                        geoBounds = new g_GeoBounds(shapeBounds.sw, shapeBounds.sw);
                    }
                    geoBounds.extend(shapeBounds.sw);
                    geoBounds.extend(shapeBounds.ne);
                }
            }
            geoBounds.refreshCenter();
            return geoBounds;
        }
        return null;
    },
    /**
		@returns {Shape[]} Returns an array of {@link Shape}
    */
    getShapes : function ()
    {
        return this._shapes;
    }
});

