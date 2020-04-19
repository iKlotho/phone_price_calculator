import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        rates: {},
        dialog: false,
    },
    mutations: {
        setRates(state, data) {
            state.rates = data
        },
        setDialog(state, data) {
            state.dialog = data
        }
    },
    actions: {
        async getRates({ commit }) {
            // Для оптимизации количества запросов клиента к серверу, необходимо писать серерную часть,
            // отдающую данные в удобном для обработки на клиентской стороне виде
            // Тогда вместо 3-х запросов, можно будет обойтись одним
            // Для тестового задания были взяты сторонние api
            const response1 = await axios.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=TRY')
            const response2 = await axios.get('https://api.exchangeratesapi.io/latest?base=EUR&symbols=TRY')
            commit('setRates', { USD: response1.data.rates.TRY, EUR: response2.data.rates.TRY, TL: 1 })
        },
        async setCustomRate({commit}, data) {
            const { USD, EUR } = data;
            commit('setRates', { USD, EUR, TL: 1})
        },
        async setDialog({commit}, data) {
            commit('setDialog', data)
        }
    }
})
