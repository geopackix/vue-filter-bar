var visitorModal = Vue.component('vi-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            availableProperties: [],
            delimiter: ','
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

            //Rebuild properties
            vm.filter.filterProperty = filter.filterProperty;
            vm.filter.filterPropertyLabel = filter.label;
            vm.filter.selectionMode = filter.selectionMode;

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

        checkboxClick(Value, Label){

            let vm = this;           
            if(vm.filter.filterValue != null){
                
                let filterSplitted = vm.filter.filterValue.split(vm.delimiter);
                
                //check if the filter is already checked - if so the filter must be removed
                let index = filterSplitted.indexOf(Value)
                if(index > -1){
                    //filter is already set and has to be removed.
                    
                    
                    let newArray= [];
                    for(i of filterSplitted){
                        if(i != Value && i != ''){
                            newArray.push(i);
                        }
                    }

                    filterSplitted = newArray;
                  
                    let newFilterValue = '';
                    for(i of filterSplitted){
                        newFilterValue += vm.delimiter + i;
                    }
                    vm.filter.filterValue = newFilterValue.substring(1);

                }else{
                    vm.filter.filterValue += vm.delimiter + Value;
                    vm.filter.filterValueLabel = 'Multi';
                }


            }else{
                vm.filter.filterValue = Value;
                vm.filter.filterValueLabel = Label;
            }

            if(vm.filter.filterValue.substring(0,1) == ','){
                vm.filter.filterValue = vm.filter.filterValue.substring(1);
            }



            
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
        
        if(vm.filter.selectionMode == 'multiple'){
            //handle default value fur mulitple filter
            let values = vm.getValues(vm.filter.filterPropertyLabel);
            
            for(value of values){
                if(value.default){
                    checkboxClick(value.filterValue, value.label);
                }
            }
        }
        


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

                        <vi-single-filter v-bind="filter" v-if="filter.selectionMode == 'single'"></vi-single-filter>

                        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{filter.filterValueLabel}}
                        </button>
                        <div class="dropdown-menu" v-if="filter.selectionMode == 'single'">
                                                  
                            <h6 class="dropdown-header">{{filter.filterProperty}}</h6>
                            <a class="dropdown-item clickable" v-for="value in getValues(filter.filterPropertyLabel)" v-on:click="setFilterValue(value.filterValue, value.label)">{{value.label}}</a>

                        </div>
                        <div class="dropdown-menu" v-if="filter.selectionMode == 'multiple'">
                            <h6 class="dropdown-header">{{filter.filterProperty}}</h6>
                            
                            <div class="form-group" >
                                <div class="form-check" v-for="value in getValues(filter.filterPropertyLabel)" >
                                    <input class="form-check-input" type="checkbox"  v-on:click="checkboxClick(value.filterValue, value.label)" >
                                    <label class="form-check-label">
                                        {{value.label}}
                                    </label>
                                </div>
                            </div>
                        </div>
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