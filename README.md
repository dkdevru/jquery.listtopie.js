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


## Demo
See demo [project page](https://dkdevru.github.io/jquery.listtopie.js/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

