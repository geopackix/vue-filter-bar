var app = new Vue({
  el: '#example-app',
  data: {
    filterRequestOptions: {
      uri: '',
      filters:[
          {
              label: 'Example property',                            //This becomes visible to the user
              filterProperty: 'filter',
              selectionMode: 'single',
              required: true,
              values: [
                  {
                      label:'Filter value "200"',
                      filterValue: '200'
                  },{
                      label:'Filter value "300" (default)',
                      filterValue: '300',
                      default: true
                  },{
                      label:'Filter value "400"',
                      filterValue: '400'
                  },{
                      label:'Filter value "500"',
                      filterValue: '500'
                  },
              ]
          },
          {
              label: 'Length',                            
              filterProperty: 'length',
              selectionMode: 'single',
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
              label: 'Search String',
              filterProperty: 'q',
              selectionMode: 'search'
          },
          {
            label: 'Start date',
            filterProperty: 'startdate',
            selectionMode: 'date'
          },
          {
            label: 'Classes',                            
            filterProperty: 'classes',
            selectionMode: 'multiple',
            delimiter: '/',
            values: [
                {
                    label:'Class A',
                    filterValue: 'a'
                },{
                    label:'Class B',
                    filterValue: 'b'
                },{
                    label:'Class C',
                    filterValue: 'c'
                },{
                    label:'Class D',
                    filterValue: 'd'
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

  },
  components: {
    //vuejsDatepicker
  }  
})