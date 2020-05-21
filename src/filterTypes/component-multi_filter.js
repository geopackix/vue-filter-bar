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
