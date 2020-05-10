# vue-filter-bar
This vue.js component provides a configurable filter bar for url-based API queries.


## Install

Due this is a vue.js component. [vue.js](https://vuejs.org/) is required.

```html
<link rel="stylesheet" href="./../src/component-filter_bar.css">

<script src="./src/component-filter_bar.js"></script>
<script src="./src/component-filter.js"></script>
```
Additional dependencies are:
* [Bootstrap](https://getbootstrap.com/)
* [Popper](https://popper.js.org/) (required for dropdown)

## Usage

Just place the vi-filter-bar at the position you need it. 

```html
<vi-filter-bar v-bind:options="filterRequestOptions" v-on:trigger-callback="callback($event)"></vi-filter-bar>
```

## API Reference
```javascript
filterRequestOptions: {
  uri: '',
  filters:[
    {
      label: 'string',                           
      filterProperty: 'string',
      required: true, //optional | default: required=false
      values: [
        {
          label:'string',
          filterValue: 'string'
        }
      ]
    }
  ]
}
```

```javascript
callback: function(uri){
  alert("callback has been called with URI = " + uri);
}
```
## Styling
The style can be customized by adjusting the CSS file accordingly. An existing UI framework is recommended. e.g. [Bootstrap](https://getbootstrap.com/)

## License

**MIT License**  |  Copyright (c) 2020 geopackix

[LICENSE](./LICENSE)