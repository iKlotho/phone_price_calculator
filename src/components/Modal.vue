<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Kurları Düzenle</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field label="USD" type="number" v-model="usd"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="EUR" type="number" v-model="eur"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="setDialog(false)">Vazgeç</v-btn>
          <v-btn color="blue darken-1" text @click="save">Kaydet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState } from "vuex";
  export default {
      name: 'Modal',
      data: () =>({
          usd: 0,
          eur: 0,
      }),
      computed: {
        ...mapState(["dialog", "rates"]),
      },
      methods: {
          setDialog(data) {
              this.$store.dispatch('setDialog', data)
          },
          save() {
              this.$store.dispatch('setCustomRate', {USD: parseFloat(this.usd), EUR: parseFloat(this.eur)})
              this.setDialog(false)
          }
      },
      mounted() {
          console.log("mount", this.rates)
          setTimeout(() => {
          this.usd = this.rates.USD;
          this.eur = this.rates.EUR;

          }, 400)
      }
    
  }
</script>