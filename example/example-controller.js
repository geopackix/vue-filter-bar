var app = new Vue({
  el: '#example-app',
  data: {
    filterRequestOptions: {
      uri: '',
      filters:[
          {
              label: 'Filter property 1',                            //This becomes visible to the user
              filterProperty: 'statuscodefilter',
              required: true,
              selectionmode: 'single',
              values: [
                  {
                      label:'Filter value 1 (default)',
                      filterValue: '200'
                  },{
                      label:'Filter value 2',
                      filterValue: '300'
                  },{
                      label:'Filter value 3',
                      filterValue: '400'
                  },{
                      label:'Filter value 4',
                      filterValue: '500'
                  },
              ]
          },
          {
              label: 'Length',                            
              filterProperty: 'length',
              selectionmode: 'single',
              values: [
                  {
                      label:'Length=18 (default)',
                      filterValue: '18'
                  },{
                      label:'Length=100',
                      filterValue: '100'
                  },{
                      label:'Length=200 (only specific)',
                      filterValue: '200&specific=true'
                  }
              ]
          },
          {
            label: 'Algorithm',                            
            filterProperty: 'algorithm',
            selectionmode: 'single',
            values: [
                {
                    label:'List',
                    filterValue: 'L'
                },{
                    label:'Tree',
                    filterValue: 'T'
                },{
                    label:'Graph',
                    filterValue: 'G'
                }
            ]
        }
      ]
    }
  },
  methods:{
    callback: function(uri){
      alert("callback has been called with URI = " + uri);
    }
  },
    
  mounted: function () {
    let vm = this;

    console.log('vue instance has been created.');




  }
})