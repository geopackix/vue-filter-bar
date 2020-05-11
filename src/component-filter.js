var visitorModal = Vue.component('vi-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            availableProperties: []
        }
    },
    methods: {
        requestAvailableProperties(){
            let vm = this;
            vm.availableProperties = vm.filter.getAvailableFilterProperties();
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
        setFilterProperty(propertyLabel){
            let vm = this;
            //overrides filter Value
            vm.filter.filterValue = null;
            vm.filter.filterValueLabel = null;

            //get propertyValue for the given property label
            let filter = vm.filter.getFilterFunction(propertyLabel);
            
            let previousLabel = vm.filter.filterPropertyLabel;

            vm.filter.filterProperty = filter.filterProperty;
            vm.filter.filterPropertyLabel = filter.label;

            vm.$emit('filter-property-selected', {old: previousLabel, new: vm.filter.filterPropertyLabel});

            vm.requestAvailableProperties();

            /**
            if(previousLabel != null){
                let previousfilter = vm.getFilterFromParent(previousLabel);
                previousfilter.status = 1;
            }
            
            filter.status = 0; //mark property as in use.
            */
        },
        setFilterValue(Value, Label){
            let vm = this;
            vm.filter.filterValue = Value;
            vm.filter.filterValueLabel = Label;
            
        },
        deleteFilter(){
            let vm = this;
            
            let filter = vm.filter.getFilterFunction(vm.filter.filterPropertyLabel);
            if(filter){
                filter.status = 1;
            }
            this.$emit('filter-delete', vm.filter.filterProperty);
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
    <div class="vi-filter">
        <table>
            <tr>
                <td class="left">
                    <div class="btn-group m-1">
                        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-on:click="requestAvailableProperties()">
                            {{filter.filterPropertyLabel}}
                        </button>
                        <div class="dropdown-menu" >
                            <a class="dropdown-item clickable" v-for="prop in availableProperties" v-on:click="setFilterProperty(prop)">{{prop}}</a>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="btn-group m-1">
                        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{filter.filterValueLabel}}
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item clickable" v-for="value in getValues(filter.filterPropertyLabel)" v-on:click="setFilterValue(value.filterValue, value.label)">{{value.label}}</a>
                        </div>
                    </div>
                </td>
                <td v-if="!filter.filterRequired">
                    <img class="clickable" src='src/assets/delete.png' width="15" height="15" v-on:click="deleteFilter()">
                </td>
            </tr>
        </table>

    </div> 
    `

})