import Vue from 'vue'
import Vuex from 'vuex'
import {db} from "@/store/db/db";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: false,
        items: [],
        search: '',
        snackbar: false,
        timeout: 2000,
        text: 'success'
    },
    getters: {
        getItems: state=> {
            if (state.search.length) {
               return state.items
                   .filter(e => {
                       return e.name.toLowerCase().indexOf(state.search.toLowerCase()) > -1
                   })
            } else {
                return []
            }
        }
    },
    mutations: {
        setItems: (state, val) => state.items.push(val),
        clearItems: state => state.items = [],
        setSearch: (state, val)=> state.search = val,
        setLoading: (state, val)=> state.loading = val,
        setSnackbar: (state, val)=> state.snackbar = val
    },
    actions: {
        async SearchAction({commit}){
            console.log(this.state.search)
            commit('clearItems')
            db.str.where('name')
                .startsWithAnyOfIgnoreCase(this.state.search)
                .each(function (str) {
                    commit('setItems', str)
                })
        },
       async genText({commit}, {len, arrlen}){
           const gen_str = (len)=>{
               let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ';
               let str = '';
               for (let i = 0; i < len; i++) {
                   let pos = Math.floor(Math.random() * chrs.length);
                   str += chrs.substring(pos,pos+1);
               }
               return str
           }
           commit('setLoading', true)
           console.log('start')
           let drops = []
           for (let i = 0; i < arrlen; i++) {
               drops.push({id: Date.parse(new Date)+i, name: gen_str(len)})
           }
           db.str.bulkAdd(drops).then(function (lastKey){
               console.log("Last id: " + lastKey);
               commit('setLoading', false)
               commit('setSnackbar', true)
           })

           // for (let i = 0; i < arrlen; i++) {
           //     await db.str.add({
           //         name: gen_str(len)
           //     })
           // }
           console.log('end')

        }
    },
    modules: {},
});
