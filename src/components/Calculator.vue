<template>
  <v-card :loading="loading" class="mx-auto my-12" max-width="574">
    <Modal />
    <v-img
      class="white--text align-end"
      height="250"
      src="https://regxlib.com/wp-content/uploads/2019/01/smarphones.jpg"
    >
      <v-card-title>Telefon Fiyat Hesaplayıcısı</v-card-title>
    </v-img>

    <v-card-title>Kur Seçiniz</v-card-title>

    <v-card-text>
      <div class="text-center" style="display:flex; justify-content:center">
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip>
            USD -
            <div style="padding-left: 5px" v-if="this.rates.USD">
              {{ this.rates.USD.toFixed(4) }} ₺
            </div>
          </v-chip>

          <v-chip
            >EUR -
            <div style="padding-left: 5px" v-if="this.rates.EUR">
              {{ this.rates.EUR.toFixed(4) }} ₺
            </div>
          </v-chip>
          <v-chip
            >TL 
          </v-chip>
        </v-chip-group>
      </div>
      <div class="text-center" style="display:flex; justify-content:center">
        <v-btn
          @click="getRates"
          class="mx-2"
          fab
          dark
          small
          color="success"
          title="Kurları Güncelle"
        >
          <v-icon dark>mdi-reload</v-icon>
        </v-btn>
        <v-btn
          @click="changeRates"
          class="mx-2"
          fab
          dark
          small
          color="primary"
          title="Kurları Düzenle"
        >
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
      </div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>

    <v-card-title>Telefon Fiyat Hesapla</v-card-title>

    <v-card-text>
      <v-select
        v-model="calcType"
        :items="calcTypes"
        item-text="name"
        item-value="key"
        :menu-props="{ maxHeight: '400' }"
        label="Hesaplama Tipi"
      ></v-select>
      <v-text-field
        label="Telefon Fiyatı"
        v-model="phonePriceRaw"
        type="number"
      >
      </v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-btn color="deep-purple lighten-2" text @click="reserve">
        Hesapla
      </v-btn>
      <v-btn color="deep-purple lighten-2" text @click="compare">
        Karşılaştır
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <div ref="printMe">
          <v-list class="transparent">
            <v-list-item>
              <v-list-item-title>Vergisiz Fiyat</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ phonePriceConverted.toFixed(3) }} ₺
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-for="item in results[calcType]" :key="item.name">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle
                class="text-right"
                v-bind:class="{
                  'font-weight-bold': item.name === 'Toplam Maliyet',
                }"
              >
                {{ item.value }} ₺
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
        <div>
          <v-btn color="" text @click="print">
            Kaydet
          </v-btn>
        </div>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-show="showCompare">
        <v-list class="transparent">
          <v-list-item>
            <v-list-item-title> </v-list-item-title>
            <v-list-item-title>İthalat</v-list-item-title>
            <v-list-item-title>Pasaport</v-list-item-title>
            <v-list-item-title>Fark</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Toplam Maliyet</v-list-item-title>
            <v-list-item-subtitle class="text-right">
              {{ salePrice.toFixed(3) }} ₺
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-right">
              {{ salePricePasaport.toFixed(3) }} ₺
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-right font-weight-bold">
              {{ (salePrice - salePricePasaport).toFixed(3) }} ₺
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import Modal from "./Modal";
import { mapState } from "vuex";

export default {
  name: "Calculator",
  components: {
    Modal,
  },
  mounted() {
    this.$store.dispatch("getRates");
  },
  data: () => ({
    calcType: "",
    phonePriceRaw: undefined,
    registrationPrice: 1838,
    show: false,
    showCompare: false,
    loading: false,
    selection: 0,
    calcTypes: [
      {
        name: "İthalat Kayıtlı",
        key: "ithalat",
      },
      {
        name: "Pasaport Kayıtlı",
        key: "pasaport",
      },
    ],
  }),
  computed: {
    ...mapState(["rates"]),
    currencies() {
      return Object.keys(this.rates);
    },
    currentRate() {
        if ( this.selection === 0) return this.rates.USD;
        if ( this.selection === 1) return this.rates.EUR;
        if ( this.selection === 2) return this.rates.TL;
        return 0;
    },
    phonePriceConverted: function() {
      console.log("cur", this.rates);
      return this.phonePriceRaw * this.currentRate;
    },
    otvRate: function() {
      if (this.phonePriceConverted > 1500) return 50;
      if (this.phonePriceConverted > 640 && this.phonePriceConverted <= 1500)
        return 40;
      if (this.phonePriceConverted <= 640) return 25;
      return 1;
    },
    otv: function() {
      return (
        ((this.phonePriceConverted + this.culture + this.trt) / 100) *
        this.otvRate
      );
    },
    culture: function() {
      return this.phonePriceConverted / 100;
    },
    trt: function() {
      if (this.calcType === "ithalat")
        return (this.phonePriceConverted / 100) * 10;
      return 20 * this.currentRate; // USD
    },
    kdv: function() {
      return (
        ((this.phonePriceConverted + this.culture + this.trt + this.otv) /
          100) *
        18
      );
    },
    salePrice: function() {
      return (
        this.phonePriceConverted + this.trt + this.otv + this.kdv + this.culture
      );
    },
    salePricePasaport: function() {
      return this.registrationPrice + this.trt + this.phonePriceConverted;
    },
    results: function() {
      return {
        pasaport: [
          {
            name: "TRT Payı",
            value: this.trt.toFixed(3),
          },
          {
            name: "Kayıt Ücreti",
            value: this.registrationPrice,
          },
          {
            name: "Toplam Maliyet",
            value: this.salePricePasaport.toFixed(3),
          },
        ],
        ithalat: [
          {
            name: "Kültür Payı",
            value: this.culture.toFixed(3),
          },
          {
            name: "TRT Payı",
            value: this.trt.toFixed(3),
          },
          {
            name: "ÖTV Payı",
            value: this.otv.toFixed(3),
          },
          {
            name: "KDV Payı",
            value: this.kdv.toFixed(3),
          },
          {
            name: "Toplam Maliyet",
            value: this.salePrice.toFixed(3),
          },
        ],
      };
    },
  },
  methods: {
    reserve() {
      this.loading = true;
      this.show = true;
      this.showCompare = false;

      setTimeout(() => (this.loading = false), 2000);
    },
    changeRates() {
      this.$store.dispatch("setDialog", true);
    },
    compare() {
      this.loading = true;
      this.show = false;
      this.showCompare = true;

      setTimeout(() => (this.loading = false), 2000);
    },
    getRates() {
      this.$store.dispatch("getRates");
    },
    async print() {
      const el = this.$refs.printMe;
      // add option type to get the image version
      // if not provided the promise will return
      // the canvas.
      const options = {
        type: "dataURL",
      };
      const output = await this.$html2canvas(el, options);
      console.log("put", output);
      this.downloadBase64File(output, "filename.png");
    },
    downloadBase64File(base64Data, fileName) {
      const linkSource = base64Data;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    },
  },
};
</script>
