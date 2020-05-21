var visitorModal = Vue.component('vi-single-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            
        }
    },
    methods: {
        apply(){
            vm.$emit('filter-apply');
        },

        getValues(propertyLabel){
            let vm = this;

            if(propertyLabel != null){
                let filter = vm.filter.getFilterFunction(propertyLabel);
                return filter.values;
            }else{
                return []
            } 
        },

        setFilterValue(Value, Label){
            let vm = this;
            vm.filter.filterValue = Value;
            vm.filter.filterValueLabel = Label;
        },
        
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
        <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{filter.filterValueLabel}}
        </button>


        <div class="dropdown-menu">      
            <h6 class="dropdown-header">{{filter.filterProperty}}</h6>
            <a class="dropdown-item clickable" v-for="value in getValues(filter.filterPropertyLabel)" v-on:click="setFilterValue(value.filterValue, value.label)">{{value.label}}</a>
        </div>
    </div> 
    `

})