import Vuex from 'vuex'
import Vue from 'vue'
import {
    HAS_ENOUGH_GOLD,
    SPEND_GOLD,
    ADD_GOLD,
    GET_GOLD,
    REMOVE_ALL_GOLD,
    INCREMENT_PAGELOADS,
    INCREMENT_VICTORIES,
    INCREMENT_DEFEATS,
    INCREMENT_HINTS,
    HINTS,
    DEFEATS,
    VICTORIES,
    PAGELOADS,
    INCREMENT_COUNTER,
    SET_COUNTER, TOTAL_GOLD
} from "@/store-constants";

Vue.use(Vuex);

function SaveGoldToLocalStorage(amnt)
{
    localStorage.setItem("gold_count", amnt);
}

function SaveKeyValue(key, value)
{
    localStorage.setItem(key, value);
}

export default new Vuex.Store({
    state: {
        gold: 0,
        [VICTORIES]: 0,
        [HINTS]: 0,
        [DEFEATS]: 0,
        [PAGELOADS]: 0,
        [TOTAL_GOLD]: 0,
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
        [ADD_GOLD](state, amnt) {
            state.gold += amnt;
            state[TOTAL_GOLD] += amnt;
            SaveGoldToLocalStorage(state.gold);
            SaveKeyValue(TOTAL_GOLD, state[TOTAL_GOLD]);
        },
        [SPEND_GOLD](state, goldToSpend) {
            state.gold -= goldToSpend;
            SaveGoldToLocalStorage(state.gold);
        },
        [INCREMENT_COUNTER](state, counterKey) {
            // eslint-disable-next-line no-prototype-builtins
            if (!state.hasOwnProperty(counterKey))
                return;

            state[counterKey]++;
            SaveKeyValue(counterKey, state[counterKey]);
        },
        [SET_COUNTER](state, {counter, amount}) {
            // eslint-disable-next-line no-prototype-builtins
            if (!state.hasOwnProperty(counter))
                return;

            state[counter] = amount;
        },
        [INCREMENT_PAGELOADS](state) {
            state[PAGELOADS]++;
            SaveKeyValue(PAGELOADS, state[PAGELOADS]);
        },
        [INCREMENT_VICTORIES](state) {
            state[VICTORIES]++;
            SaveKeyValue(VICTORIES, state[VICTORIES]);
        },
        [INCREMENT_DEFEATS](state) {
            state[DEFEATS]++;
            SaveKeyValue(DEFEATS, state[DEFEATS]);
        },
        [INCREMENT_HINTS](state) {
            state[HINTS]++;
            SaveKeyValue(HINTS, state[HINTS]);
        }

    },
    action: {

    }
});