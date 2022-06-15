<template>
  <v-app>
    <v-app-bar app color="">
      logo
    </v-app-bar>
    <v-main >
      <v-container>
        <div style="max-width: 1200px;">
          <v-card color="#f8f5f2">
            <v-card-title>Add
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="3" >
                  <v-text-field
                      label="Длина строки"
                      v-model="strlen"
                      solo
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                      label="Количество строк"
                      v-model="arrlen"
                      solo
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-btn dark color="#078080" @click="addSrt">
                    <v-progress-circular
                        v-if="loading"
                        style="margin-right: 5px"
                        size="25"
                        indeterminate
                    ></v-progress-circular>
                    Добавить
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card color="#f8f5f2" style="margin-top: 20px">
            <v-card-title>Search</v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="search"
                  solo
                  @keypress.enter="SearchAction"
              >
                <template v-slot:append>
                  <v-btn icon @click="SearchAction">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>

              <ul style="margin-left: 10px">
                <div style="margin-bottom: 10px">Result: {{getItems.length}}</div>
                <li
                    style="margin-bottom: 5px;"
                    v-for="item in getItems"
                    :key="item.id"
                    v-html="BoldSearch(item.name)"></li>
              </ul>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-main>
    <v-footer app>
      <v-col
          class="text-center"
          cols="12"
      >
        {{ new Date().getFullYear() }}
      </v-col>
    </v-footer>

    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        bottom
        color="success"
        outlined
        top
        width="200"
        min-width="50"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar=false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: 'App',
  components: {},
  created() {
  },
  data: () => ({
    strlen: 100,
    arrlen: 1000,
  }),
  methods: {

    BoldSearch(e){
      let start = e.toLowerCase().indexOf(this.search.toLowerCase())
      let end = this.search.length
      return `${start>0? e.slice(0, start): ''}<strong style="color: black">${e.slice(start, start+end)}</strong>${e.slice(start+end)}`
    },
    addSrt(){
      this.genText({len: this.strlen, arrlen: this.arrlen })
    },
    ...mapActions({
      genText: "genText",
      SearchAction: "SearchAction"
    }),
    ...mapMutations({
      setSearch: 'setSearch',
      clearItems: "clearItems",
      setSnackbar: "setSnackbar"
    })
  },
  watch:{
    search(){
      if(!this.search.length){
        this.clearItems()
      }
    }
  },
  computed:{
    search:{
      get: function (){
        return this.$store.state.search
      },
      set: function (val) {
        this.setSearch(val)
      }
    },
    snackbar:{
      get: function (){
        return this.$store.state.snackbar
      },
      set: function (val) {
        this.setSnackbar(val)
      }
    },
    ...mapState({
      items: state => state.items,
      loading: state => state.loading,
      timeout: state => state.timeout,
      text: state => state.text
    }),
    ...mapGetters({
      getItems: "getItems"
    }),

  }

};
</script>
<style>
*{
  font-family: Roboto, sans-serif;
}
</style>
