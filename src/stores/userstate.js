import { defineStore } from 'pinia';
import json from '../data/datagame.json';
import { _ } from 'lodash';

export const useUserStore = defineStore({
    id: 'userstate',
    state: () => ({
        buildings: {
            "townhall": {
                "units": [
                    {
                        currentLevel: 1,
                    }
                ],
            },
            "builder-hut": {
                "units": [
                    {
                        currentLevel: 1,
                        status: true,
                    }
                ],
            }
        },
        thlevel: 1,
        exp: 0,
        maxGold: 0,
        currentGold: 500,
        currentElixir: 500,
        producedGold: 0,
        producedElixir: 0,
        currentExp: 0,
    }),
    getters: {
        getBuildings: (state) => state.buildings,
        getMaxGold: (state) => json.data.level[state.thlevel].master["gold-available"] + _.sumBy(state.buildings["gold-storage"]?.units, '["structure"]["capacity"]'),
        getMaxElixir: (state) => json.data.level[state.thlevel].master["elixir-available"] + _.sumBy(state.buildings["elixir-storage"]?.units, '["structure"]["capacity"]'),
        getGoldCapacity: (state) => _.sumBy(state.buildings["gold-mine"]?.units, '["structure"]["capacity"]'),
        getElixirCapacity: (state) => _.sumBy(state.buildings["elixir-collector"]?.units, '["structure"]["capacity"]')
    },
    actions: {
        upThLevel() {
            this.thlevel++;
        },
        addStructure(name, building) {

            let items = this.buildings[name]?.units ? this.buildings[name].units?.length : 0;
            if (items == 0) this.buildings[name] = { "units": [] };

            /*
            * Push unit
            */
            this.buildings[name].units.push(building);
            if (building.structure.token == "gold") this.currentGold -= building.structure.price;
            if (building.structure.token == "elixir") this.currentElixir -= building.structure.price;

            /*
            * Push exp
            */
            this.currentExp += building.structure["exp-gained"];
        },
        updateStructure(name, building, key) {
            this.buildings[name].units[key] = building;

            if (building.structure.token == "gold") this.currentGold -= building.structure.price;
            if (building.structure.token == "elixir") this.currentElixir -= building.structure.price;
            if (name == 'townhall') this.thlevel++;

            /*
            * Push exp
            */
            this.currentExp += building.structure["exp-gained"];
        },
        addGoldBySeconds() {
            this.producedGold += _.sumBy(this.buildings["gold-mine"]?.units, '["structure"]["production-rate"]') / 3600;
        },
        addElixirBySeconds() {
            this.producedElixir += _.sumBy(this.buildings["elixir-collector"]?.units, '["structure"]["production-rate"]') / 3600;
        },
        collectGold() {
            this.currentGold += Math.round(this.producedGold);
            this.producedGold = 0;
        },
        collectElixir() {
            this.currentElixir += Math.round(this.producedElixir);
            this.producedElixir = 0;
        }
    }
});