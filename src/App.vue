<template>
    <v-app style="background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%);">
       <v-container fluid grid-list-lg style="">
      <v-layout row wrap>
        <v-flex xs12>
      <Calculator />
        </v-flex>
      </v-layout>
       </v-container>
    </v-app>
</template>

<script>
import Calculator from './components/Calculator.vue';

export default {
  name: 'App',
  components: {
    Calculator
  }
}
</script>
