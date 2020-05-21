var visitorModal = Vue.component('vi-filter-bar', {
    props: ['options'],
    data: ()=>{
        return {
            _availableFilters : null,
            filters:[],
            numberOfAvailableProperties: 0,
            collapsed: false,
        }
    },
    methods: {
        //i.o.
        addFilter(){
            let vm = this;
            vm.filters.push({
                _availableFilters: vm._availableFilters,
                filterProperty: null,
                filterPropertyLabel: null,
                filterValue: null,
                filterValueLabel: null,
                filterRequired: false,
                selectionMode: 'single',
                delimiter: ',',
                getFilterFunction: vm.getFilter,
                getAvailableFilterProperties: vm.getAvailableFilterProperties
            });
        },

        addRequiredFilter(propertyLabel){
            let vm = this;

            let filter = vm.getFilter(propertyLabel)

            vm.filters.push({
                _availableFilters: vm._availableFilters,
                filterProperty: filter.filterProperty,
                filterPropertyLabel: filter.label,
                filterValue: vm.getDefaultValue(filter.label).filterValue || null,
                filterValueLabel: vm.getDefaultValue(filter.label).label || null,
                filterRequired: true,
                delimiter: filter.delimiter || ',',
                selectionMode: filter.selectionMode || 'single',
                getFilterFunction: vm.getFilter,
                getAvailableFilterProperties: ()=>{return false}
            });

            vm.filerPropertyInUse({old:null, new: filter.label})
        },
        getDefaultValue(propertyLabel){
            
            let filter = this.getFilter(propertyLabel);

            if(filter.selectionMode == 'single'){
                //Search for default value
                for(value of filter.values){
                    if(value.default){
                        return value
                    }
                }
                //If no default value was found, the first element would be taken as a default.
                return filter.values[0];
            }
            return false;
        },
        //Delete an Filter from the filters array
        deleteFilter(filterProperty){
            let vm = this;
            //delete filter from filters array.
            let tempfilters = []
            
            for(filter of vm.filters){
                if(filter.filterProperty != filterProperty){
                    tempfilters.push(filter);
                }else{
                    filter.status = 1;
                }
            }
            //override filters array with temp array.
            vm.filters = tempfilters;
            if(filterProperty != null){
                vm.getAvailableFilterProperties()
            }
        },

        //Mark filter property as in use
        filerPropertyInUse(opt){
            let vm = this;
            
            let oldLabel = opt.old;
            let newLabel = opt.new;

            let newFilter = vm.getFilter(newLabel);
            //set status to 'in use'
            newFilter.status = 0;
            //newFilter.required = false;

            if(oldLabel){
                let oldFilter = vm.getFilter(oldLabel);
                //set status to 'available'
                oldFilter.status = 1;
            }
        },

        //This request returns a list of available (not in use) filters
        getAvailableFilterProperties(){
            let vm = this;
            let result = [];
            for (property of vm._availableFilters){
                if(property.status > 0){
                    result.push(property.label)
                }      
            } 
            if(result.length > 0){
                vm.propsAvailable = true;
                vm.numberOfAvailableProperties = result.length;
                return result;
            }else{
                vm.propsAvailable = false;
                vm.deleteFilter(null);
                vm.numberOfAvailableProperties = 0;
                return false;
            }
        },

        //Returns the filter object from the _availableFilters property
        getFilter(propertyLabel){
            if(propertyLabel != null){
                let vm = this;
                for(property of vm._availableFilters){
                    if(propertyLabel == property.label){
                        return property;
                    }
                }
            }else{
                return false
            }
        },
        
        triggerCallback(){
            let vm = this;
            vm.options.uri = vm.uri;
            vm.$emit('trigger-callback', vm.options.uri)
        },

        toggleCoppapse(){
            let vm = this;
            vm.collapsed = !vm.collapsed;
            console.log(vm.collapsed);
        }
    },
    computed: {
        uri(){
            let vm = this;
            let uri = '';
            for(filter of vm.filters){
                if(filter.filterProperty != null && filter.filterValue != null){
                    //build uri string from filter property and value
                    uri += '&'+filter.filterProperty + '=' + filter.filterValue;
                }
            }
            return uri.slice(1, uri.length);
        },
    },
    created: async function(){
        let vm = this;
        
        //Copy filters array and add status property
        vm._availableFilters= vm.options.filters
        for(filter of vm._availableFilters){
            filter.status = 1;
            //add required filters
            if(filter.required){
                vm.addRequiredFilter(filter.label);
            }
        }

        vm.getAvailableFilterProperties()
        
    },
    template: 
    `
    <div class="vi-filter-bar">
        <div class="collapse-toggle">
            <button v-if="!collapsed" type="button" class="btn" v-on:click="toggleCoppapse()"><img class="clickable" src="./assets/collapse-close.png" width="15" height="15"></button>
            <button v-if="collapsed" type="button" class="btn" v-on:click="toggleCoppapse()"><img class="clickable" src="./assets/collapse-open.png" width="15" height="15"></button>
        </div>    
        
        <h5>Filter options</h5>
        
        <table v-if="!collapsed">
            <tr>
                <td v-for="filter in filters">
                    <vi-filter v-bind:filter="filter" v-on:filter-delete="deleteFilter($event)" v-on:filter-property-selected="filerPropertyInUse($event)"></vi-filter>
                </td>
                <td class="left"></td>
                <td>
                    <div v-if="true">
                        <button type="button" class="btn" v-on:click="addFilter()"><img class="clickable" src='./assets/add.png' width="20" height="20"> ({{numberOfAvailableProperties}})</button>
                    </div>
                    
                </td>
                <td>
                    <button type="button" class="btn" v-on:click="triggerCallback()"><img class="clickable" src='./assets/reload.png' width="20" height="20"></button>
                </td>
            </tr>            
            
                
        </table>
        <p class="mono">{{uri}}</p>
    </div> 
    `

})
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
var visitorModal = Vue.component('vi-multi-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            availableProperties: [],
            //delimiter: ';',
            checked:[],
            dropdownTitle: 'none'
        }
    },
    methods: {
        apply(filterValue){
            let vm = this;
            setTimeout(function(){
                
                console.log('multi-filter has been applied');
                console.log(vm.checked);

                if(vm.checked.length > 1){
                    vm.dropdownTitle = 'multiple'
                }else if(vm.checked.length < 1){
                    vm.dropdownTitle = 'none'
                }else{
                    vm.dropdownTitle = vm.checked[0].label;
                }

                //concat filter values
                let string = ''
                for(value of vm.checked){
                    string += value.filterValue;
                    //for all elements except for the last element
                    if(value !== vm.checked[vm.checked.length-1]){
                        string += vm.filter.delimiter;
                    }
                }

                vm.filter.filterValue = string;

                //vm.$emit('filter-apply');
            },0);
            
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
        
    },
    computed: {   
    },
    mounted: async function(){
        let vm = this;
        //vm.requestAvailableProperties();
        
        
        //defult values
        /*
        let filter = vm.filter.getFilterFunction(vm.filter.filterPropertyLabel)
        
        for(value of filter.values){
            if(value.default){
                vm.checked.push({
                    label : value.label,
                    filterValue : value.filterValue
                })
            }
        }*/ 
    },
    template: 
    `
    <div class="vi-multi-filter">
        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{dropdownTitle}}
        </button>
        <div class="dropdown-menu" v-if="filter.selectionMode == 'multiple'">
            <h6 class="dropdown-header">{{filter.filterProperty}}</h6>
            <div class="form-group" >
                <div class="form-check" v-for="v in getValues(filter.filterPropertyLabel)" >
                    <input class="form-check-input" type="checkbox" v-bind:value="v" v-model="checked" v-on:click="apply(v)">
                    <label class="form-check-label">
                        {{v.label}}
                    </label>
                </div>
            </div>
        </div>
    </div> 

        
    `

});

//v-on:click="checkboxClick(value.filterValue, value.label)"

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
        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{filter.filterValueLabel}}
        </button>

        <div class="dropdown-menu" >      
            <h6 class="dropdown-header">{{filter.filterProperty}}</h6>
            <a class="dropdown-item clickable" v-for="value in getValues(filter.filterPropertyLabel)" v-on:click="setFilterValue(value.filterValue, value.label)">{{value.label}}</a>
        </div>
    </div> 
    `

})