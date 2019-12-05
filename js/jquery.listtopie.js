/* global window, document, define, jQuery, setInterval, clearInterval */
;(function(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
} ( function ( $ ) {
  'use strict';
  var Listtopie = window.Listtopie || {};

  Listtopie = ( function () {
    function Listtopie( element, settings ) {

        var _ = this, dataSettings;
        // defaults options
        _.defaults = {
            size: 'auto',
            startAngle: 0,
            drawType: 'round',
            useMenu: false,
            strokeColor: '#cccccc',
            backColor: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: '400',
            backColorOpacity: '0.5',
            hoverEvent: true,
            hoverBorderColor: 'gray',
            hoverSectorColor: false,
            hoverAnimate: true,
            hoverWidth: 1,
            speedDraw: 500,
            speedRotate: 200,
            usePercent: false,
            easingType: mina.linear,
            strokeWidth: 2,
            marginCenter: 0,
            setValues: true,
            textColor: '#000000',
            textSize: '12',
            listVal: false,
            listValClick: false,
            listValMouseOver: false,
            listValClass: 'listtopie-list',
            listValInsertClass: '',
            sectorRotate: false,
            valList: function( elem, i, val ) {
                return $('<span rel=' + i + ' class="listtopie-link"/>').text(val);
            },
            infoText: false,
            infoTextBlockOpacity: '0.8',
            dataJson: null,
            appendList: $(element),
            initialChangeSector: 0,
            initialHoverSector: 0
        };

        _.initials = {
            currentChangeSector: 0,
            currentHoverSector: 0,
            proDraw: 0,
            startDeg: 0,
            proClick: 0,
            angle: 0,
            transformAngle: 0,
            browserName: _.getBrowserName(),
            itemSumm: 0,
            elSize: null,
            itemCount: 0,
            $svg: null,
            $infoTextBlock: null,
            $svgCenter: null,
            $rect: null,
            $sectors: [],
            $snap: null,
            $g: null,
            $gText: null,
            $gTextTemp: null,
            $elemLeft: null,
            $elemTop: null,
            $list: null
        };

        $.extend(_, _.initials);

        _.itemArr = [];
        _.$elem = $(element);

        dataSettings = $(element).data('listtopie') || {};
        _.options = $.extend({}, _.defaults, settings, dataSettings);
        _.currentChangeSector = _.options.initialChangeSector;
        _.currentHoverSector = _.options.initialHoverSector;
        _.init(true);

    }
  return Listtopie;
    
}());


// type check function
Listtopie.prototype.isNumeric = function ( n ) {
  return !isNaN( parseFloat ( n ) ) && isFinite ( n );
};
    
// function to determine the browser
Listtopie.prototype.getBrowserName = function ( n ) {
  var name;

  if (( navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
    name = 'opera';
  } else if( navigator.userAgent.indexOf("Chrome") != -1 ) {
    name = 'chrome';
  } else if ( navigator.userAgent.indexOf("Safari") != -1 ) {
    name = 'safari';
  } else if ( navigator.userAgent.indexOf("Firefox") != -1 ) {
    name = 'firefox';
  // IF IE > 10
  } else if (( navigator.userAgent.indexOf("MSIE") != -1 ) || ( !!document.documentMode == true )) {
    name = 'ie';
  } else {
    name = 'unknown';
  }
  return name;
};
    
// function destroy plugin, unbind events, remove elements
Listtopie.prototype.destroy = function ( refresh ) {
  var _ = this;
  _.cleanUpEvents();

  if (_.$listV) {
    _.$listV
      .remove();
  }
  
  if ( _.options.listValInsertClass.length > 0 ) {
    $( '.' + _.options.listValInsertClass )
      .children()
      .remove();
  }
  
  if ( _.$snap ) {
    _.$snap
      .remove();
  }

  if ( _.$infoTextBlock ) {
    _.$infoTextBlock
      .remove();
  }

  _.$elem
    .children()
    .removeClass( 'listtopie-item' );

  if ( $( _.$elem ).hasClass( 'listtopie-initialized' ) ) {
    $(_.$elem)
      .removeClass( 'listtopie-initialized' );
  }

  _.itemArr = [];
  $.extend( _, _.initials, { itemCount: 0 } );
  $.extend( _, _.initials, { $sectors:[] } );

  if ( !refresh ) {
    _.$elem
      .trigger( 'unInit', [_] );
  }
};
    
Listtopie.prototype.listtopieSetOption = function () {
/**
 * accepts arguments in format of:
 * - for changing a single option's value:
 * .listtopie("listtopieSetOption", option, value, refresh )
*/

  var _ = this, option, value, 
    refresh = false, type;

  if ( $.type( arguments[0] ) === 'string' ) {
    option =  arguments[0];
    value = arguments[1];
    refresh = arguments[2];

    if ( typeof arguments[1] !== 'undefined' ) {
      type = 'single';
    }
  }

  if ( type === 'single' ) {
    _.options[option] = value;
  }

  if ( refresh ) {
    _.destroy( true );
    _.init();
   }
};
    
Listtopie.prototype.listtopieGetOption = function ( option ) {
  var _ = this;
  return _.options[option];
};
    
Listtopie.prototype.cleanUpEvents = function () {
  var _ = this;
  $( "li", _.$listV )
    .off( "click" )
    .off( "mouseenter" )
    .off( "mouseleave" );
};
    
Listtopie.prototype.refresh = function ( initializing ) {
  var _ = this;
  _.destroy ( true );
  _.init();
};
    
Listtopie.prototype.build = function () {
    var _ = this,i;

    if (_.options.drawType === 'simple') {
      _.options.speedDraw = 10;
	}
    
    if ( _.options.dataJson !== null && typeof($.parseJSON(_.options.dataJson)) === 'object' ) {
	// create array of sectors if dataJson not null
	$.each($.parseJSON(_.options.dataJson), function ( index, it ) {
		var n = it.name;
		var v = parseFloat(it.value.replace(',', '.'));
		var c = it.color;
		
		if( _.isNumeric(v) === true ) {
		  _.itemArr.push({'id': index+1, 'v': v, 'n': n, 'c':c});
		  _.itemSumm = _.itemSumm + v;
		  _.itemCount++; 
    	}
		});	
	} else {
	// create array of sectors
    _.$elem
        .children( _.options.item )
        .addClass( "listtopie-item" )
        .each( function( index ) {
        	if( _.options.useMenu === true ) {
        	  var v = $(this).contents().get(0).nodeValue;	
    		}
        	else{
        	  var v = parseFloat($(this).text().replace(',', '.'));
    		}
        	var n = $(this).children().text();
        	var c = $(this).data('lcolor');
        	if ( _.isNumeric(v) === true && _.options.useMenu === false ) {
    		  _.itemArr.push({'id': index+1, 'v': v, 'n': n, 'c':c});
    		  _.itemSumm = _.itemSumm + v;
    		  _.itemCount++; 
        	} else if( _.options.useMenu === true ) {
        		_.itemArr.push({'id': index+1, 'v': 1, 'mv': v, 'n': n, 'c':c});
        		_.itemSumm = _.itemSumm + 1;
        		_.itemCount++; 
    		}
        });
    }
    
    //adding to array ItemArr property percent
    for (i = 0; i < _.itemCount; i += 1) {
    	var per = (_.itemArr[i].v / _.itemSumm) * 100;
    	_.itemArr[i]["per"] = per;
    }
    
    if( _.options.size === 'auto' ) {
    	
		var w = _.$elem.width();
		var h = _.$elem.height();
		
		if (h == 0)
			{
			_.$elem.height(w);
			_.$elem.css('height',_.elSize + 'px');
			}
		_.elSize = parseInt(Math.max(w,h));
	} else {
    	_.elSize = parseInt(_.options.size);
    	_.$elem.css('width',_.elSize + 'px');
    	_.$elem.css('height',_.elSize + 'px');
	}
    
    if ( _.elSize && _.itemCount > 0 ) {
    	//  get element center
    	_.$svgCenter = _.$elem[0].getBoundingClientRect().width/2;
    	//  if _.options.startAngle is not empty and is number and is not equal to any of the possible values set value is 0
    	if ( _.isNumeric( _.options.startAngle ) === true && ( _.options.startAngle !== 0 && _.options.startAngle !== 90 && _.options.startAngle !== 180 && _.options.startAngle !== 270 ) ){
    	  _.options.startAngle = 0;
    	}
    	
    	if ( _.options.startAngle === 0 ) {
    	  _.$svg = $( '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + _.elSize  +' ' + _.elSize + '" preserveAspectRatio="none" class="listtopie-svg"></svg>' )
    	    .appendTo(_.$elem);
    	} else if ( _.options.startAngle > 0 && _.options.startAngle <= 360 ) {
    	_.$svg = $('<svg xmlns="http://www.w3.org/2000/svg" style="-webkit-transform:rotate(' + _.options.startAngle + 'deg);-ms-transform:rotate(' + _.options.startAngle + 'deg);-o-transform:rotate(' + _.options.startAngle + 'deg);transform:rotate(' + _.options.startAngle + 'deg);-webkit-transform-origin: '+ _.$svgCenter +'px '+ _.$svgCenter +'px;" viewBox="0 0 ' + _.elSize  +' ' + _.elSize + '" preserveAspectRatio="none" class="listtopie-svg"></svg>').appendTo(_.$elem);
    	}
    	_.$snap = Snap(_.$svg[0]);
    	_.$rect = _.$elem[0].getBoundingClientRect();
    	_.$g = _.$snap.g();
    	_.$gText = _.$snap.g();
    	_.$gTextTemp = _.$snap.g();
    	_.$elemLeft = _.$rect.left;
    	_.$elemTop = _.$rect.top;
	}
    
    // append to element info block
  if( _.options.infoText === true ) {
    _.$infoTextBlock = $( "<div></div>" )
      .appendTo( _.$elem )
      .addClass( "listtopie-info-block" );
  }
};
    
// running draw sectors function
Listtopie.prototype.run = function () {
  var _ = this;
  _.drawSector( _.itemArr[0].per/100,_.startDeg,_.options.useMenu === true ? _.itemArr[0].mv : _.itemArr[0].v, _.itemArr[0].n,_.itemArr[0].c );
};
    
    //main drawing function
    Listtopie.prototype.drawSector = function ( percent,start,val,content,color ) {
    	 /**
         * percent - quantitative value of the sector
         * start - sector start value
         * val - sector angle value
         * content - sector value
         * color - sector color
         */
    	
    	var _ = this;
    	var sector = null;
    	var centerSector = (percent * 359.99)/2;
    	
    	//auxiliary line for placing the text in the center of the sector
    	_.getPathLine(
	              {x:_.$svgCenter, y:_.$svgCenter},
	              _.options.marginCenter, _.$svgCenter - 10,
	              _.startDeg, centerSector, _.proDraw);
    	
    	Snap.animate(0, percent * 359.99, function ( deg ) {
    		
    		if ( sector ) sector.remove();
    		_.startDeg = start + deg;
    		
    		// set attributes sector
    		 var attr = {
    				 id: "Path" + _.$snap.id + _.proDraw,
    				 idInt: _.proDraw,
  				      stroke:_.options.strokeColor,
  				      fill: color ? color : _.options.backColor,
  				      fillOpacity: _.options.drawType === 'round' ? _.options.backColorOpacity : 0,
  				      strokeWidth: _.options.strokeWidth,
  				      start: start,
 				      deg: deg,
   				      note: val,
   				      desc: content
  				    };
    		 
    		 //function returns sector path
    		 sector = _.getPathSector(
  		              {x:_.$svgCenter, y:_.$svgCenter},
  		              _.options.marginCenter, _.$svgCenter - 10,
  		              start, deg, attr);
    		// add sector to group
    		 _.$g.add(sector);
    		 
    	}, _.options.speedDraw, _.options.easingType, 
    	// callback function after drawing sector
    	function(){
    		_.proDraw++;
    		 if ( _.options.drawType === "fade" ){
    			 	sector.animate({
	    			fillOpacity:_.options.backColorOpacity
		    		}, _.options.speedDraw, _.options.easingType);		
				}
    		
    		if ( _.options.setValues === true ){	
    				// we get the coordinates of the auxiliary line to insert a temporary text
    				var coorVal = _.$snap.select("#l" + _.$snap.id + sector.attr('idInt')).getBBox();
    				var center_test = {x:coorVal.cx, y:coorVal.cy};

    					//temporary text attributes
	             		var attr_text_temp = {
	             				"stroke":_.options.textColor,
	            				"font-size":_.options.textSize,
	    	    				"tx":center_test.x,
	    	    				"ty":center_test.y,
	    	    				"fontFamily": _.options.fontFamily,
	            				"font-weight":_.options.fontWeight,
	    	    				"opacity": 0
	     				    };

    					//temporary text attributes
	             		var tempText = _.$snap.text(center_test.x,center_test.y,sector.attr('note')).attr(attr_text_temp);
	               		var tempTextbbox = tempText.getBBox();
	               		var tempTextwidth = center_test.x - tempTextbbox.width/2;
	               		var tempTextheight = center_test.y + tempTextbbox.height/2;
	               		_.$gTextTemp.add(tempText);

    					//sector value text attributes
	               		var attr_text = {
	               				'id':'t' + _.$snap.id + sector.node.id,
	            				'stroke':_.options.textColor,
	            				'fill':_.options.textColor,
	            				'font-size':_.options.textSize,
	            				'tx':center_test.x,
	            				'ty':center_test.y,
	            				'pointer-events':'none',
	            				'fontFamily': _.options.fontFamily,
	            				'font-weight':_.options.fontWeight,
	            				'opacity':_.options.drawType === 'simple' ? 0 : 1,
	            				'transform': "r-" + _.options.startAngle + "," + center_test.x + ',' + center_test.y
	        				    };
	               		
	               		//insert value in the center of the sector
	               		var arcText = _.$snap.text(tempTextwidth,tempTextheight,sector.attr('note')).attr(attr_text);
	               		//add text to group
	               		_.$gText.add(arcText);
			 }
    		
    		
    		if (_.proDraw !== _.itemCount)
    		{
    			//draw sectors and run
				_.drawSector(_.itemArr[_.proDraw].per/100,_.startDeg,_.options.useMenu === true ? _.itemArr[_.proDraw].mv : _.itemArr[_.proDraw].v,_.itemArr[_.proDraw].n,_.itemArr[_.proDraw].c);
				_.$sectors.push(sector);
    		}
		else
			{
			//draw last sector
				_.$sectors.push(sector);
				if (_.options.drawType === 'simple')
					{
						_.$sectors.forEach(function(el) {
						el.attr({'fillOpacity':_.options.backColorOpacity});
	    				_.$gText.select('#t' + _.$snap.id + el.attr('id')).attr({'opacity':'1'});
	    				});
					}
				//delete temporary text
				_.$gTextTemp.remove();
				_.sectorsEvents();
			}
    	});
    };
    
    Listtopie.prototype.getPathLine = function(centre, rIn, rOut, startDeg, delta, id) {
    	var _ = this;
    	
    			//calculate the coordinates of the starting point of the auxiliary line
    			var startIn = {
        	    x: centre.x + rIn * Math.cos(Math.PI*(startDeg + delta)/180),
        	    y: centre.y + rIn * Math.sin(Math.PI*(startDeg + delta)/180)
        	    };
    			//calculate the coordinates of the end point of the auxiliary line
        	    var endOut = {
        	    x: centre.x + rOut * Math.cos(Math.PI*(startDeg + delta)/180),
        	    y: centre.y + rOut * Math.sin(Math.PI*(startDeg + delta)/180)
        	    };


 			var tempValues = {
 					  id:'l' + _.$snap.id + id
				    };
		    	var tempValuesPath = _.$snap.line(startIn.x,startIn.y,endOut.x,endOut.y);
		    	tempValuesPath.attr(tempValues);
		    
    };
    
Listtopie.prototype.getPathSector = function ( centre, rIn, rOut, startDeg, delta, attr ) {
  var _ = this;
  var startOut = {
	    x: centre.x + rOut * Math.cos( Math.PI*(startDeg) / 180 ),
	    y: centre.y + rOut * Math.sin( Math.PI*(startDeg) / 180 )
	    };
	    var endOut = {
	    x: centre.x + rOut * Math.cos(Math.PI*(startDeg + delta)/180),
	    y: centre.y + rOut * Math.sin(Math.PI*(startDeg + delta)/180)
	    };
	    var startIn = {
	    x: centre.x + rIn * Math.cos(Math.PI*(startDeg + delta)/180),
	    y: centre.y + rIn * Math.sin(Math.PI*(startDeg + delta)/180)
	    };
	    var endIn = {
	    x: centre.x + rIn * Math.cos(Math.PI*(startDeg)/180),
	    y: centre.y + rIn * Math.sin(Math.PI*(startDeg)/180)
	    };

    	    
    	    var largeArc = delta > 180 ? 1 : 0;
    	    var path = "M" + startOut.x + "," + startOut.y +
    	     " A" + rOut + "," + rOut + " 0 " +
    	     largeArc + ",1 " + endOut.x + "," + endOut.y +
    	     " L" + startIn.x + "," + startIn.y +
    	     " A" + rIn + "," + rIn + " 0 " +
    	     largeArc + ",0 " + endIn.x + "," + endIn.y +
    	     " L" + startOut.x + "," + startOut.y + " Z";
    	
    	    var drawPath = _.$snap.path( path );
    	    drawPath.attr(attr);
    	    return drawPath;
};
    
    Listtopie.prototype.sectorsEvents = function ( ) {
    	var _ = this, sX, sY;
    	
    	_.$sectors.forEach(function(el) {
    		
	    		el.node.onmouseover = function ( e ) {
	    			if ( _.options.hoverEvent === true ) {
	    			  _.sectorHover({
	    	            data: {
	    	                message: 'index',
	    	                index: parseInt( el.attr( "idInt" ) )
	    	            }
	    	          });
	    				}
	        		if ( _.options.infoText === true ) {
	        			_.initMouseMove({message:'on',index: parseInt(el.attr('idInt'))});
	        		}
	        	};
	        	el.node.onmouseout = function ( e ) {
	        		if( _.options.hoverEvent === true ){
	        		_.sectorUnHover({
	    	            data: {
	    	                message: 'index',
	    	                index: parseInt(el.attr('idInt'))
	    	            }
	    	        });
    				}
	        		if ( _.options.infoText === true ) {
	        			_.initMouseMove({message:'off',index: parseInt(el.attr('idInt'))});
	        		}
	        	};
	        	
    		if ( _.options.sectorRotate === true ){
        	el.node.onclick = function ( e ) {
        		
        		if ( ( e.x - _.$elemLeft ) === _.$svgCenter || (e.y - _.$elemTop) === _.$svgCenter ) {
		    	  return false;
		    	}
        		
        		if ( _.browserName === "firefox" ) {
	        		
	        		switch (_.options.startAngle) {

		            case 90:
		            	sX = _.$elem.width() - e.layerY;
		    			sY = e.layerX;
		                break;

		            case 180:
		            	sX = _.$elem.width() - e.layerX;
		    			sY = _.$elem.width() - e.layerY;
		                break;

		            case 270:
		            	sX = e.layerY;
		    			sY = _.$elem.width() - e.layerX;
		                break;

		            default:
		            	sX = e.layerX;
		    			sY = e.layerY;	
		        }
	        		
        		} else if ( _.browserName === "ie" ) {
	        		sX = e.x;
	        		sY = e.y;	
        		} else {
		    	
		            switch ( _.options.startAngle ) {

		            case 90:
		            	sX = _.$elem.width() - e.offsetY;
		    			sY = e.offsetX;
		                break;

		            case 180:
		            	sX = _.$elem.width() - e.offsetX;
		    			sY = _.$elem.width() - e.offsetY;
		                break;

		            case 270:
		            	sX = e.offsetY;
		    			sY = _.$elem.width() - e.offsetX;
		                break;

		            default:
		            	sX = e.offsetX;
		    			sY = e.offsetY;	
		        }
		    		
        		}
        		
        		_.sectorChange({
    	            data: {
    	            	pos: {
    	            		x:sX,
    	            		y:sY
    	            	},
    	                message: 'index',
    	                index: parseInt(el.attr('idInt'))
    	            }
    	        });
        		
        	};
    		}
    	});
    };
    
    Listtopie.prototype.initMouseMove = function( data ) {
    	 /**
         * state - on or off events
         * index - sector index
         * titleText - sector value
         * contentText - sector text if use option useMenu
         * percent - word
         * trueX, trueY - cursor coordinates
         */
    	var _ = this,
    	state = data.message,
    	index = data.index,
    	titleText,
    	contentText = '',
    	percent = '',
    	trueX, trueY;
    	
    	if ( _.options.usePercent === true ) {
        	percent = '%';
    	}
    	
    	if ( _.$sectors[index].attr('desc') !== null ) {
    	  contentText = _.$sectors[index].attr('desc');
    	}

    	if ( _.options.useMenu === true ) {
    		titleText = _.$sectors[index].attr("note");
    		} else {
    		titleText = parseFloat(_.$sectors[index].attr("note"));
    		}
    	
    	var infoTextValue = titleText + percent + ' ' + contentText;
    	
    	if ( state === "on" ) {
    		_.$snap.mousemove( moveFunc );
		} else if ( state === 'off' ) {
    		_.$snap
    		  .unmousemove();
    		_.$infoTextBlock
    		  .css("opacity","0");
		}
    	
    	function moveFunc( ev, x, y ) {

    		if ( _.browserName === "firefox" ) {
	        		trueX = ev.layerX;
	        		trueY = ev.layerY;	
        		} else if ( _.browserName == "ie" ) {
        		trueX = ev.x;
        		trueY = ev.y;	
    		}
        	else
        		{
		    		trueX = ev.offsetX;
		    		trueY = ev.offsetY;
        		}
    	
    		if (_.browserName == 'ie')
    			{
    				_.$infoTextBlock.css('opacity',_.options.infoTextBlockOpacity).css('left',trueX + 'px').css('top',trueY + 'px').text(infoTextValue);
    			}
    		else
    			{
    		
            switch (_.options.startAngle) {

            case 90:
            	_.$infoTextBlock.css('opacity',_.options.infoTextBlockOpacity).css('left', _.$elem.width() - trueY + 'px').css('top',trueX + 'px').text(infoTextValue);
                break;

            case 180:
            	_.$infoTextBlock.css('opacity',_.options.infoTextBlockOpacity).css('left',_.$elem.width() - trueX + 'px').css('top',_.$elem.width() - trueY + 'px').text(infoTextValue);
                break;

            case 270:
            	_.$infoTextBlock.css('opacity',_.options.infoTextBlockOpacity).css('left',trueY + 'px').css('top',_.$elem.width() - trueX + 'px').text(infoTextValue);
                break;

            default:
            	_.$infoTextBlock.css('opacity',_.options.infoTextBlockOpacity).css('left',trueX + 'px').css('top',trueY + 'px').text(infoTextValue);
        }
    			}
    		
    	}
    };
    
    
    Listtopie.prototype.sectorHover = function(event) {
    	var _ = this,
        indexHover = event.data.index,
        rColor,
        startHover,
        degHover,
        pathHover;
    	
    	var shover_check = _.$snap.select(".shover");
    	//if there is an active sector we delete it
		if(shover_check){
		  _.$snap.select(".shover").remove();
		}
		
		if (_.options.hoverSectorColor == true){
		  rColor =  _.$sectors[indexHover].attr('fill');
		}
		else{
		  rColor = _.options.hoverBorderColor;
		}
		
		var attrHover = {
	      "stroke": rColor,
	      "strokeWidth":0,
	      "fill":_.options.backColor,
	      "fillOpacity":0,
	      "class":"shover",
	      "pointer-events":"none"
		};
		
	    	  startHover = parseFloat(_.$sectors[indexHover].attr('start'));
	    	  degHover = parseFloat(_.$sectors[indexHover].attr('deg'));	    	  
	    	  pathHover = _.getPathSector({x:_.$svgCenter, y:_.$svgCenter}, 
	    			  _.options.marginCenter, 
	    			  _.$svgCenter - 10, startHover, degHover, attrHover);
	    	  _.$g.add(pathHover);
	    	  
	    	  if (_.options.hoverAnimate === false){
	    	  pathHover.attr({strokeWidth:_.options.strokeWidth + + _.options.hoverWidth});
	    	  }
	    	  else if(_.options.hoverAnimate == true){
	    		  pathHover.animate({
		    		  strokeWidth:_.options.strokeWidth + _.options.hoverWidth
		    		}, _.options.speedDraw, _.options.easingType);  
	    		  }
	    	  _.currentHoverSector = indexHover;
	    	  _.$elem.trigger('afterHover', [_]);
    };
    
Listtopie.prototype.sectorUnHover = function ( event ) {
  var _ = this;
  if( _.options.hoverEvent === true ) {
    var shover_check = _.$snap.select( ".shover" );
    if ( shover_check ) {
      _.$snap.select( ".shover" ).remove();
    }
  }
};
    
    
    Listtopie.prototype.sectorChange = function(event) {
    	var _ = this,
    	postrue, indexSector = event.data.index;
    	postrue = {x:event.data.pos.x, y:event.data.pos.y};
    	
    	
    	var startp = parseFloat(_.$sectors[indexSector].attr('start'));
   	    var degp = parseFloat(_.$sectors[indexSector].attr('deg'));
   	    
   	    
   	    if(_.options.sectorRotate === true){
   	    	if(_.proClick == 0){
   		    	if (startp >= 0 && startp < 179){
	    		  _.angle = startp + degp/2;
	    		  _.orientation = 'ackw';
   		    	}
   		    	else if(startp > 179 && startp <= 359){
	    		  _.angle = 360 - startp - degp/2;
	    		  _.orientation = 'ckw';
		    	}
   			}
   		else if ( _.proClick > 0 )
   			{
   			
   			if ((postrue.y > _.$svgCenter && postrue.x > _.$svgCenter && (_.options.startAngle == 0 || _.options.startAngle == 270)) || ((postrue.y > _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 90)) || ((postrue.y < _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 90 || _.options.startAngle == 180)) || ((postrue.y < _.$svgCenter && postrue.x > _.$svgCenter) && (_.options.startAngle == 180 || _.options.startAngle == 270)))
   				{
   			var all_summa = 0;
   			var click_sector = indexSector;
   			var active_sector;
   			
   			//get idInt active sector
   			_.$snap.selectAll('path').forEach( function( el ) {
  		    		if (el.attr('active') == 1)
  		    			{
  		    				active_sector = parseInt(el.attr('idInt')); 
  		    			}
  		    	});
   			
   			if (click_sector > active_sector)
   				{
   				var pro_sector_summa = false;
   				_.$snap.selectAll('path').forEach( function( el ) {
   				
   				if (el.attr('idInt') !== null)
	    			{
   				
   				if (el.attr('active') == 1)
					{
						pro_sector_summa = true;
					}
   				
   				if (pro_sector_summa === true)
   					{
   					
   					if (el.attr('idInt') == active_sector)
   						{
   						all_summa = all_summa + parseFloat(el.attr('deg'))/2;
   						}
   					else if (el.attr('idInt') != click_sector)
   						{
   						all_summa = all_summa + parseFloat(el.attr('deg'));
   						}
   					
   					
   					if (el.attr('idInt') == click_sector)
   						{
   						all_summa = all_summa + parseFloat(el.attr('deg'))/2;
   						return false;
   						}
   					}
   				
   			}
   				
		    	});
   				}
   			else if (click_sector < active_sector)
   				{
   				var pro_sector_summa = true;
	    			
   				_.$snap.selectAll('path').forEach( function( el ) {
	    				if (el.attr('idInt') !== null)
		    			{
		          		if (pro_sector_summa === true)
	    					{
		          			if (el.attr('idInt') == click_sector)
		          				{
	    					all_summa = all_summa + parseFloat(el.attr('deg'))/2;
	    						}
		          			else
		          				{
		          			all_summa = all_summa + parseFloat(el.attr('deg'));	
		          				}
	    					
	    					if (el.attr('idInt') == click_sector)
	    						{
	    						pro_sector_summa = false;
	    						}
	    					
	    					}
	    				
	    				if (el.attr('active') == 1)
   					{
	    					all_summa = all_summa + parseFloat(el.attr('deg'))/2;
	    					pro_sector_summa = true;
   					}
		    			}
 		    	});
   				}
   			
   			if (_.orientation == 'ckw')
				{
   					_.angle = all_summa - _.angle;
					_.orientation = 'ackw';
				}
			else if (_.orientation == 'ackw')
				{
				 _.angle = _.angle + all_summa;
				}
   				}
   			
   			//if click more center
   			else if ((postrue.y > _.$svgCenter && postrue.x > _.$svgCenter && (_.options.startAngle == 90 || _.options.startAngle == 180)) || ((postrue.y > _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 180 || _.options.startAngle == 270)) || ((postrue.y < _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 270)) || ((postrue.y < _.$svgCenter && postrue.x > _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 90)))
				{
	    			var all_summa = 0;
	    			var click_sector = indexSector;
	    			var active_sector;
	    			
	    			//get idInt active sector
	    			_.$snap.selectAll('path').forEach( function( el ) {
      		    		if (el.attr('active') == 1)
      		    			{
      		    				active_sector = parseInt(el.attr('idInt')); 
      		    			}
      		    	});
	    			
	    			if (click_sector > active_sector)
	    				{
	    			var pro_sector_summa = true;
	    			
	    			
	    			_.$snap.selectAll('path').forEach( function( el ) {
	    				if (el.attr('idInt') !== null)
		    			{
	    				if (pro_sector_summa === true)
	    					{
	    					
	    					if (el.attr('idInt') == active_sector)
   						{
   						all_summa = all_summa + parseFloat(el.attr('deg'))/2;
   						}
   					else if (el.attr('idInt') != click_sector)
   						{
   						all_summa = all_summa + parseFloat(el.attr('deg'));
   						}
	    					
	    					}
	    				
	    				if (el.attr('active') == 1)
   					{
	    					pro_sector_summa = false;
   					}
	    				if (el.attr('idInt') == click_sector)
						{
	    					all_summa = all_summa + parseFloat(el.attr('deg'))/2;
	    					pro_sector_summa = true;
						}
		    			}
 		    	});
	    				}
	    			else if (click_sector < active_sector)
	    				{
	    				var pro_sector_summa = false;
		    			
		    			
	    				_.$snap.selectAll('path').forEach( function( el ) {
		    				if (el.attr('idInt') !== null)
   		    			{
		    				if (pro_sector_summa === true)
		    					{
		    					
		    					if (el.attr('idInt') == active_sector)
	    						{
	    						all_summa = all_summa + parseFloat(el.attr('deg'))/2;
	    						}
	    					else if (el.attr('idInt') != click_sector)
	    						{
	    						all_summa = all_summa + parseFloat(el.attr('deg'));
	    						}
		    					
		    					if (el.attr('idInt') == active_sector)
		    						{
		    						pro_sector_summa = false;
		    						}
		    					}
		    				
		    				if (el.attr('idInt') == click_sector)
	    					{
		    					all_summa = all_summa + parseFloat(el.attr('deg'))/2;
	    						pro_sector_summa = true;
	    					}
   		    			}
     		    	});
	    				
	    				}
	    					if (_.orientation == 'ackw')
	    						{
	    						 	_.angle = all_summa - _.angle;
	    							_.orientation = 'ckw';
	    						}
	    					else if (_.orientation == 'ckw')
	    						{
	    						 	_.angle = _.angle + all_summa;
	    						}
	    				
	    				}
   		//if click more center
   			}
   		
		    if ( _.proClick == 0 ){
		    	
		    	
		    		if (((postrue.y > _.$svgCenter && postrue.x > _.$svgCenter && (_.options.startAngle == 0 || _.options.startAngle == 270))) || ((postrue.y > _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 90)) || ((postrue.y < _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 90 || _.options.startAngle == 180)) || ((postrue.y < _.$svgCenter && postrue.x > _.$svgCenter) && (_.options.startAngle == 180 || _.options.startAngle == 270)))
		    			{
		    			_.animateChange(-_.angle, _.angle, true);
		    			}
		    		else if (((postrue.y > _.$svgCenter && postrue.x > _.$svgCenter && (_.options.startAngle == 90 || _.options.startAngle == 180))) || ((postrue.y > _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 180 || _.options.startAngle == 270)) || ((postrue.y < _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 270)) || ((postrue.y < _.$svgCenter && postrue.x > _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 90)))
		    			{
		    			_.animateChange(_.angle, _.angle, false);
		    			}
		    		
   			}
		    else if (_.proClick > 0)
	    		{
		    		if (((postrue.y > _.$svgCenter && postrue.x > _.$svgCenter && (_.options.startAngle == 0 || _.options.startAngle == 270))) || ((postrue.y > _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 90)) || ((postrue.y < _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 90 || _.options.startAngle == 180)) || ((postrue.y < _.$svgCenter && postrue.x > _.$svgCenter) && (_.options.startAngle == 180 || _.options.startAngle == 270)))
   				{
		    			_.animateChange(-_.angle, _.angle, true);
   				}
		    		else if (((postrue.y > _.$svgCenter && postrue.x > _.$svgCenter && (_.options.startAngle == 90 || _.options.startAngle == 180))) || ((postrue.y > _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 180 || _.options.startAngle == 270)) || ((postrue.y < _.$svgCenter && postrue.x < _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 270)) || ((postrue.y < _.$svgCenter && postrue.x > _.$svgCenter) && (_.options.startAngle == 0 || _.options.startAngle == 90)))
	    			{
		    			_.animateChange(_.angle, _.angle, false);
	    			}
	    		}
		}
   	    
   	    _.$snap.selectAll('path').forEach( function( el ) {
    		el.attr('active','');	
    	});
   	    
   	    // set active change sector
   	    _.currentChangeSector = indexSector; 
   	    _.$sectors[indexSector].attr('active','1');
   	    // increase the click counter
    	_.proClick++;
    };
    
Listtopie.prototype.animateChange = function(ang,angText,angTextCheck) {
	var _ = this;
	// rotate sectors
	 Snap.animate(_.transformAngle,ang,function(ang) { _.$g.transform('r' + ang + "," + _.$svgCenter + "," + _.$svgCenter)},_.options.speedRotate, _.options.easingType, 
    		    function() {
		 _.transformAngle = ang;
		 _.$elem.trigger('afterChange', [_]);
	 });
 	// rotate sectors text value
	 Snap.animate(_.transformAngle,ang,function(ang) { _.$gText.transform('r' + ang + "," + _.$svgCenter + "," + _.$svgCenter)},_.options.speedRotate, _.options.easingType);
	_.rotateText(angText,angTextCheck);
	
};
    
Listtopie.prototype.changeGoTo = function(id) {
  var _ = this;

  var el_change = _.$snap.select("#Path" + _.$snap.id + id).getBBox();

  _.sectorChange({
    data: {
    	pos: {
		    x: el_change.cx - _.$rect.left,
    		y: el_change.cy - _.$rect.top
    	},
        message: 'index',
        index: parseInt(id)
    }
  });
};
    
Listtopie.prototype.rotateText = function(angleVal,check) {
  var _ = this;
	
  if ( check === true ) {
    _.$snap.selectAll( "text" ).forEach( function ( t ) {
	  var tx = t.attr( "tx" );
	  var ty = t.attr( "ty" );
	  t.animate({ transform: "r" + (angleVal - _.options.startAngle) + "," + tx + ',' + ty}, 200 );
    });
	} else if (check === false) {
      _.$snap.selectAll( "text" ).forEach( function ( t ) {
	  var tx = t.attr( "tx" );
	  var ty = t.attr( "ty" );
	  t.animate( { transform: "r" + - ( angleVal + _.options.startAngle ) + "," + tx + ',' + ty}, 200 );
    });	
  }
};
    
Listtopie.prototype.getCurrentChangeSector = function () {
    var _ = this;
    return _.currentChangeSector;
};

Listtopie.prototype.getSectorAttr = function( id,name ) {
  var _ = this,
  valueAttr;
  valueAttr = _.$snap.select("#Path" + _.$snap.id + id).attr(name);
  return valueAttr;
};

Listtopie.prototype.getCurrentHoverSector = function () {
  var _ = this;
  return _.currentHoverSector;
};

Listtopie.prototype.hoverGoTo = function ( id ) {
  var _ = this;
  _.sectorHover({
    data: {
        message: 'index',
        index: parseInt(id)
    }
  });
};
    
    Listtopie.prototype.buildlistVal = function() {
    	
        var _ = this, i, listV, percent = '';
        
        // if _.options.usePercent is true, a percent sign is added after the value
        if ( _.options.usePercent === true ) {
          percent = '%';
    	}
        
        // generates a list of values ​​from sectors
        if ( _.options.listVal === true ) {
        	listV = $("<ul class='listtopie-list'/>")
        	  .addClass( _.options.listValClass );
        	
        	for ( i = 0; i < _.itemCount; i += 1 ) {
        		listV.append($('<li />').append('<div class="listtopie-link-color-out"><span class="listtopie-link-color" style="background-color:' + _.itemArr[i].c + ';"/></div>').append(_.options.valList.call(this, _, i, _.itemArr[i].v + percent + ' ' + _.itemArr[i].n)));
            }
        	
        	if ( _.options.listValInsertClass.length > 0 ) {
    		  _.$listV = listV.appendTo($('.' + _.options.listValInsertClass));
        	} else {
        	  _.$listV = listV.appendTo( _.options.appendList );
        	}
        	
        	}
    };
    
Listtopie.prototype.initlistValEvents = function() {
// event handlers for the list of values
var _ = this;
if ( _.options.listValClick === true ) {
	$('li', _.$listV).on( 'click', function ( e ) {   		
		e.preventDefault();
		_.sectorHover({
            data: {
                message: 'index',
                index: parseInt(e.target.attributes.rel.value)
            }
        });	
	});        	
}
if ( _.options.listValMouseOver === true ) {
	
	$('li', _.$listV).on('mouseenter', function ( e ) {   		
		e.preventDefault();
		_.sectorHover({
            data: {
                message: 'index',
                index: parseInt(e.target.attributes.rel.value)
            }
        });	
	});
	
	$('li', _.$listV).on('mouseleave', function(e){   		
		e.preventDefault();
		
		var shover_check = _.$snap.select( ".shover" );
		if( shover_check ) {
		  _.$snap.select(".shover").remove();
		}
	});
	
}
};
    
Listtopie.prototype.init = function ( creation ) {
  var _ = this;

  if ( !$( _.$elem ).hasClass( "listtopie-initialized" )) {
    $( _.$elem )
      .addClass( "listtopie-initialized" );
    _.build();
    _.run();
    _.buildlistVal();
    _.initlistValEvents();
  }

  if ( creation ) {
    _.$elem.trigger( "init", [_] );
  }
};


    $.fn.listtopie = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].listtopie = new Listtopie(_[i], opt);
            else
                ret = _[i].listtopie[opt].apply(_[i].listtopie, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));