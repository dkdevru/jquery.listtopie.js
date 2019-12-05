# jquery.listtopie.js
jQuery SVG Pie Charts Builder

## Installation

Just add a link to the css file in your <head/>:
```
<link rel="stylesheet" type="text/css" href="/css/jquery.listtopie.css"/>
```

Then, before your closing <body/> tag add:
```
<script type="text/javascript" src="/js/jquery.min.js"></script>
<script type="text/javascript" src="/js/snap.svg-min.js"></script>
<script type="text/javascript" src="/js/jquery.listtopie.min.js"></script>
```

## Usage
HTML:
```
<div class='row'>
<div data-lcolor="#313c42">38.4<span>Coal</span></div>
<div data-lcolor="#ef8e39">23.2<span>Natural Gas</span></div>
<div data-lcolor="#005ce6">16.3<span>Hydro</span></div>
<div data-lcolor="#de2821">10.4<span>Nuclear fission</span></div>
</div>

//IF CREATE MENU WITH NOTE

<div class='row'>
<div data-lcolor="#313c42">4 Oct 1957<span>The world's first artificial satellite</span></div>
<div data-lcolor="#ef8e39">28 May 1959<span>First creatures to return alive from space</span></div>
<div data-lcolor="#005ce6">12 Apr 1961<span>The first man in space</span></div>
</div>
```
JAVASCRIPT:
```
$('.row').listtopie({
drawType:'round',
strokeWidth:0
});
```

## Options

| Options | Type | Default | Description
| --- | --- | --- | --- |
| `appendList` | string | $(element) | Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object). |
| `backColor` | string | '#ffffff' | Sets the sector background. |
| `backColorOpacity` | string | '0.5' | Sets the opacity of the background sector. |
| `dataJson` | string | null | If you use data in json format, you need to pass it to this parameter. Example: [{"name":"Germany","value":"20.75","color":"blue"},{"name":"Japan","value":"13.71","color":"red"}] |
| `drawType` | string | 'round' | Pie chart drawing type. Simple - drawing without animation. Fade - fade animation. Round - sectors are drawn in a circle one by one. |
| `easingType` | string | mina.linear | Easign type animation. (mina.linear, mina.easeout, mina.easein, mina.easeinout, mina.backin, mina.backout, mina.elastic, mina.bounce) |
| `fontFamily` | string | 'Arial' | If you use non-standard fonts, for example Google Fonts, pass the font name to this parameter |
| `fontWeight` | string | '400' | Is meant for setting the weight (boldness) of the font |
| `hoverAnimate` | boolean | true | Enable animation on hover over sector. |
| `hoverBorderColor` | string | 'gray' | Line color when you hover the mouse over a sector. |
| `hoverEvent` | boolean | true | Includes highlighting a sector with the mouse hover color. |
| `hoverSectorColor` | boolean | false | Includes highlighting a sector with the mouse hover color. |
| `hoverWidth` | integer | 1 | Set width border sector on hover over sector. |
| `infoText` | boolean | false | Adds an information window with a sector value. Moves the mouse cursor. |
| `infoTextBlockOpacity` | string | '0.8' | Opacity value infoText window. |
| `initialChangeSector` | number | 0 | The index of the active change sector is the default. |
| `initialHoverSector` | number | 0 | The index of the active hover sector is the default. |
| `listVal` | boolean | false | Forms a list of values ​​from sectors and inserts it inside an element. If you want to insert a list in a specific place, use listValInsertClass |
| `listValClass` | string | 'listtopie-list' | Assigns the css class name to the list. |
| `listValClick` | boolean | false | Clicking on an item in the list will highlight the corresponding sector. |
| `listValInsertClass` | string | '' | Class name to insert a list of sector values. |
| `listValMouseOver` | boolean | false | Hovering the mouse over an item in the list will highlight the corresponding sector. |
| `marginCenter` | integer | 0 | Sets indent from center. |
| `sectorRotate` | boolean | false | Turns on rotation animation when selecting a sector. |
| `setValues` | boolean | true | Displays the value inside the sector. |
| `size` | string | auto | Width and height element and svg. If the value is auto, then svg will be equal to the width and height of the parent element. |
| `speedDraw` | integer | 500 | Draw animation speed. |
| `speedRotate` | integer | 200 | 	Rotate animation speed. |
| `startAngle` | integer | 0 | 	Sets the origin of the coordinates. Possible values (0,90,180,270). If you specify a value other than those specified, 0 will be set. |
| `strokeColor` | string | '#cccccc' | Sets the color of the sector lines. |
| `strokeWidth` | integer | 2 | Sector line width. |
| `textColor` | string | '#000000' | Text color. |
| `textSize` | string | '12' | Text size. |
| `useMenu` | boolean | false | When using the parameter all sectors will be the same size. |
| `usePercent` | boolean | false | When using the parameter, a percent sign will be added after the sector value. |
| `valList` | function | n/a | Custom value list templates. |

## Events

Use them before the initialization of listtopie as shown below:

```
$('.row').on('afterChange', function(event, listtopie){
console.log(listtopie.currentChangeSector);
});
```

| Event | Params |  Description
| --- | --- | --- |
| `init` | event, listtopie | When Listtopie initializes for the first time callback. Note that this event should be defined before initializing the plugin. |
| `unInit` | event, listtopie | When plugin is destroyed. |
| `afterChange` | event, listtopie | If sectorRotate is true. When rotation of elements is included. After the rotation is completed afterChange. |
| `afterHover` | event, listtopie | After the hover is completed afterHover. |

## Methods

Methods are called on listtopie instances through the listtopie method itself, see below:

```
var currentChangeSector = $('.row').listtopie('getCurrentChangeSector');
```

| Method | Params |  Description
| --- | --- | --- |
| `hoverGoTo` | index : int | Goes to sector by index, hover are used. |
| `changeGoTo` | index : int | Goes to sector by index, animation and rotation are used. |
| `getCurrentChangeSector` | index : int | 	Returns the index of the selected sector. |
| `getCurrentHoverSector` | index : int | 	Returns the index of the last sector on which there was a hover event. |
| `getSectorAttr` | index : int, name: string | Will return a sector attribute. |
| `listtopieSetOption` | change an option, refresh is always boolean | Sets an option value. |
| `listtopieGetOption` | option : string(option name) | Gets an option value. |
| `refresh` |  | Reinitializes listtopie plugin. |
| `destroy` |  | Destroys listtopie plugin. |

## Example

Change the speed with:

```
$('.row').listtopie('listtopieSetOption', 'speedDraw', 500, true);
```

Get property value useMenu:

```
$('.row').listtopie('listtopieGetOption','useMenu');
```

Get sector value:

```
$('.row').listtopie('getSectorAttr',2,'note');
```

Hover sector number 2:

```
$('.row').listtopie('hoverGoTo',2);
```

## Requirements

IE9 and up, Safari, Chrome, Firefox, and Opera

jQuery versions supported:

jquery.js >= 1.7.1

Snap.svg versions supported:

0.4.1 >= snap.svg.js >= 0.3.0

## Demo
See demo [project page](https://dkdevru.github.io/jquery.listtopie.js/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

