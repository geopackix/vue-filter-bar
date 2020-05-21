var visitorModal = Vue.component('vi-date-filter', {
    props: ['filter'],
    data: ()=>{
        return {
            date: null
        }
    },
    methods: {
        
    },
    watch: { 
        date: function(newVal, oldVal) { 
            let vm = this;
            vm.filter.filterValue = newVal.valueOf();
            
        }
    },
    computed: {   
    },
    mounted: async function(){
        let vm = this;
        
        
    },
    template: 
    `
    <div class="vi-date-filter">
        <date-picker v-model=date type="datetime"></date-picker>
    </div> 
    `

})