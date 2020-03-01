import Vuex from 'vuex'
import Vue from 'vue'
import {HAS_ENOUGH_GOLD, SPEND_GOLD, ADD_GOLD, GET_GOLD, REMOVE_ALL_GOLD} from "@/store-constants";

Vue.use(Vuex);

function SaveGoldToLocalStorage(amnt)
{
    localStorage.setItem("gold_count", amnt);
}

export default new Vuex.Store({
    state: {
        gold: 0,
    },
    getters: {
        [GET_GOLD](state) { return state.gold; },
        [HAS_ENOUGH_GOLD](state, cost) {return state.gold >= cost;}
    },
    mutations: {
        [REMOVE_ALL_GOLD](state) {
            state.gold = 0;
            SaveGoldToLocalStorage(state.gold);
        },
        [ADD_GOLD](state, numFlags) {
            state.gold += numFlags;
            SaveGoldToLocalStorage(state.gold);
        },
        [SPEND_GOLD](state, goldToSpend) {
            state.gold -= goldToSpend;
            SaveGoldToLocalStorage(state.gold);
        }
    },
    action: {

    }
});