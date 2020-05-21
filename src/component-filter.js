var visitorModal = Vue.component('vi-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            availableProperties: [],
        }
    },
    methods: {
        requestAvailableProperties(){
            let vm = this;
            vm.availableProperties = vm.filter.getAvailableFilterProperties();
        },
        
        setFilterProperty(propertyLabel){
            let vm = this;
            //overrides filter Value
            vm.filter.filterValue = null;
            vm.filter.filterValueLabel = null;

            //get propertyValue for the given property label
            let filter = vm.filter.getFilterFunction(propertyLabel);
            
            let previousLabel = vm.filter.filterPropertyLabel;

            //Rebuild properties
            vm.filter.filterProperty = filter.filterProperty;
            vm.filter.filterPropertyLabel = filter.label;
            vm.filter.selectionMode = filter.selectionMode;

            vm.$emit('filter-property-selected', {old: previousLabel, new: vm.filter.filterPropertyLabel});

            vm.requestAvailableProperties();

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
        
        /*if(vm.filter.selectionMode == 'multiple'){
            //handle default value fur mulitple filter
            let values = vm.getValues(vm.filter.filterPropertyLabel);
            
            for(value of values){
                if(value.default){
                    checkboxClick(value.filterValue, value.label);
                }
            }
        }*/
        


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
                    <div class="btn-group m-1" >

                        <vi-single-filter v-bind:filter="filter" v-if="filter.selectionMode == 'single'"></vi-single-filter>

                        <vi-multi-filter v-bind:filter="filter" v-if="filter.selectionMode == 'multiple'"></vi-multi-filter>

                        <vi-search-filter v-bind:filter="filter" v-if="filter.selectionMode == 'search'"></vi-search-filter>
                        
                    </div>
                </td>
                <td v-if="!filter.filterRequired">
                    <img class="clickable" src='./assets/delete.png' width="15" height="15" v-on:click="deleteFilter()">
                </td>
            </tr>
        </table>

    </div> 
    `

})