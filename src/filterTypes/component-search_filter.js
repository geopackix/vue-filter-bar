var visitorModal = Vue.component('vi-search-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            searchString: ''
        }
    },
    methods: {
        
    },
    watch: { 
        searchString: function(newVal, oldVal) { 
            let vm = this;
            //vm.filter.filterValue = vm.searchString.split(" ").join("%20");
            //vm.filter.filterValue = vm.filter.filterValue.split("/").join("%2F");

            vm.filter.filterValue = encodeURIComponent(vm.searchString);
            console.log('searchString changed');

            if(this.searchString.length < 1){
                vm.filter.filterValue = null;

            }
            
      }
    },
    computed: {   
    },
    mounted: async function(){
        let vm = this;
        //vm.requestAvailableProperties();
        
    },
    template: 
    `
    <div class="vi-single-filter">
        
        <label for="exampleInputEmail1">{{filter.filterValueLabel}}</label>
        <input type="text" class="form-control-sm" id="exampleInputEmail1" v-model="searchString" aria-describedby="search" >
        
    </div> 
    `

})