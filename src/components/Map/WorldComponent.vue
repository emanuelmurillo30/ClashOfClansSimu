<template>
  <div>

    <div class="dashboard">

        <div class="left-data">
           
            Current Townhall level: {{ userstate.thlevel }}
            
            <hr>
            <br>
            <div>
                Gold: {{ userstate.currentGold }} / {{ userstate.getMaxGold }}
            </div>
            <div>
                Elixir: {{ userstate.currentElixir }} / {{ userstate.getMaxElixir }}
            </div>

            <div>
                <br>
                Gold produced: {{ userstate.producedGold.toFixed(1) }} / {{ userstate.getGoldCapacity }}
                <button :disabled="Math.round(userstate.producedGold) < 1" @click="userstate?.collectGold()">Collect Gold</button>
            </div>

            <div>
                Elixir produced: {{ userstate.producedElixir.toFixed(1) }} / {{ userstate.getElixirCapacity }}
                <button :disabled="Math.round(userstate.producedElixir) < 1" @click="userstate?.collectElixir()">Collect Elixir</button>
            </div>
            
            <br>
            <div>
                Current Experience: {{ userstate.currentExp }}
            </div>
            <br>
            <hr>
            
            Store

            <div>
                <div v-for="(structures, type) in availableBuildings" :key="type">
                    <h2> {{ type }}</h2>
                    <div v-for="(data, structure) in structures" :key="structure">
                        
                        {{ structure }} :  {{ userstate?.buildings[structure]?.units?.length ? userstate?.buildings[structure]?.units.length : 0 }} / {{ data["max-build"] }}
                        
                        <template v-if="userstate?.buildings[structure]?.units?.length > 0">
                            <div v-for="(building, key) in userstate?.buildings[structure]?.units" :key="key">
                                <div class="building-info">
                                    Current level: {{ building.currentLevel }} - 
                                    Hitpoints: {{ data.level[building.currentLevel]?.hitpoints }}
                                </div>
                                <div class="building-actions">
                                    <template v-if="structure != 'townhall'">
                                        <button :class="{ notenough: !checkUpdate(getNextUpdate(type, structure, key)) }" v-if="userstate?.buildings[structure]?.units?.length > 0 && structure != 'builder-hut'" :disabled="!getNextUpdate(type, structure, key)"  @click="updateStructure(structure, getNextUpdate(type, structure, key), key)">Update {{ getNextUpdate(type, structure, key)?.structure?.price }} {{ getNextUpdate(type, structure, key)?.structure?.token  }}</button>
                                    </template>
                                    <template v-else>
                                        <button :class="{ notenough: !checkUpdate(getNextUpdate(type, structure, key)) }" v-if="getNextUpdate(type, structure, key)" :disabled="!getNextUpdate(type, structure, key)"  @click="updateStructure(structure, getNextUpdate(type, structure, key), key)">Update {{ getNextUpdate(type, structure, key)?.structure?.price }} {{ getNextUpdate(type, structure, key)?.structure?.token  }}</button>
                                    </template>
                                </div>
                                <div v-if="userstate?.buildings[structure]?.units?.length-1 == key" class="building-actions">
                                    <button :class="{ notenough: !checkUpdate(getNextBuy(type, structure, key)) }" v-if="!userstate?.buildings[structure]?.units?.length || userstate?.buildings[structure]?.units?.length < data['max-build']" @click="buyStructure(structure, getNextBuy(type, structure, key))">Buy {{ getNextBuy(type, structure, key)?.structure?.price }} {{ getNextBuy(type, structure, key)?.structure?.token }}</button>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="building-actions">
                                <button :class="{ notenough: !checkUpdate(getNextBuy(type, structure)) }" v-if="!userstate?.buildings[structure]?.units?.length || userstate?.buildings[structure]?.units?.length < data['max-build']" @click="buyStructure(structure, getNextBuy(type, structure))" > Buy {{ getNextBuy(type, structure)?.structure?.price }} {{ getNextBuy(type, structure)?.structure?.token  }}</button>              
                            </div>
                        </template>
                  

                        
                    </div>
                    
                </div>
            </div>
            
            
        </div>

        
        <div class="right-data">
            <div class="world-matrix">
                <div class="world-rows" v-for="(rows, x) in matrix" :key="x">
                    <div v-for="(value, y) in rows" :key="y" class="world-space" :data-x="x" :data-y="y" :defined="true" :data-value="value"></div>
                </div>
            </div>
            <div>
                <div>
                <button @click="addStructure(townhall, true)">Agregar townhall</button>
                <button @click="saveStructurePosition(townhall)">Save structure townhall</button>
                <button @click="removeStructure(townhall)">Remove townhall</button>
                </div>

                <div>
                <button @click="addStructure(mine, true)">Agregar Mine</button>
                <button @click="saveStructurePosition(mine)">Save structure Mine</button>
                <button @click="removeStructure(mine)">Remove Mine</button>
                </div>
            </div>

        </div>
    </div>




    
  </div>
</template>

<script>
import { zeros } from 'mathjs';
import { _ } from 'lodash';
import { ref, reactive, computed, onMounted  } from 'vue';
import json from '../../data/datagame.json';
import { useUserStore } from '@/stores/userstate';

export default {

    setup() {

        let editMode = ref(false);
        let currentStructure = reactive();
        let currentLevel = ref(1);
        let datagame = json;
        const userstate = reactive(useUserStore());


        // Create a new clock
        
        onMounted(() => {
            setInterval(() => {
                if(userstate.producedGold < userstate.getGoldCapacity){
                    userstate?.addGoldBySeconds();
                }
                if(userstate.producedElixir < userstate.getElixirCapacity){
                    userstate?.addElixirBySeconds();
                }
            }, 10);
        })
        

        const getAvailableBuildings = () => {
            let buildings = {};
            for(let level = 1; level <= userstate?.thlevel; level++ ){
                buildings = _.merge(buildings, datagame?.data?.level[level].buildings);
            }

            /*
            * Add next Townhall
            */
            let nextTownHall = datagame?.data?.level[userstate?.thlevel+1]?.buildings?.main?.townhall;
            if(nextTownHall) {
                buildings =  _.merge(buildings, { main: { townhall: nextTownHall} } );
            }
            
            return buildings;
        };

        let availableBuildings = reactive(getAvailableBuildings());

        
        /*
        * Map Methods
        */
        const matrix = reactive(zeros([44, 44]));

        const townhall = reactive({
            map: {
                value: 2,
                positionX: 22,
                positionY: 22,
                sizeXY: 4
            },
            atts: {
                level: 1
            }
        });

        const mine = reactive({
            map: {
                value: 3,
                positionX: 22,
                positionY: 22,
                sizeXY: 3
            },
            atts: {
                level: 1,
                oph: 500,
            }
        });

        const addStructure = (structure, editMode = false) => {
            (editMode) ? setEditMode(editMode, structure) : editMode;
            for(let sizeX = 0; sizeX < structure.map.sizeXY; sizeX++){
                matrix[structure.map.positionY][structure.map.positionX+sizeX] = (editMode) ? 1 : structure.map.value;
                for(let sizeY = 0; sizeY < structure.map.sizeXY; sizeY++){
                    matrix[structure.map.positionY+sizeY][structure.map.positionX+sizeX] = (editMode) ? 1 : structure.map.value;
                }
            }
        }

        const setEditMode = (mode, structure) => {
            editMode = mode;
            currentStructure = structure;
        } 

        const removeStructure = (structure) => {
            for(let sizeX = 0; sizeX < structure.map.sizeXY; sizeX++){
                matrix[structure.map.positionY][structure.map.positionX+sizeX] = 0;
                for(let sizeY = 0; sizeY < structure.map.sizeXY; sizeY++){
                    matrix[structure.map.positionY+sizeY][structure.map.positionX+sizeX] = 0;
                }
            }
        }
        
        const moveStructure = (structure, positionX, positionY, editMode = false) => {
            if( (positionY >= 0 && positionY + structure.map.sizeXY <= 44) && (positionX >= 0 && positionX + structure.map.sizeXY <= 44 )){
                removeStructure(structure);
                structure.map.positionX = positionX;
                structure.map.positionY = positionY;
                addStructure(structure, editMode);
            }
        }

        const saveStructurePosition = (structure) => {
            editMode = false;
            addStructure(structure, editMode);
        }

        const keyPress = (e) => {
            console.log(currentStructure);
            console.log(editMode);
            if(editMode){
                e = e || window.event;

                if (e.keyCode == '38') {
                    // Up
                    moveStructure(currentStructure, currentStructure.map.positionX, currentStructure.map.positionY-1, true);
                }
                else if (e.keyCode == '40') {
                    // Down
                    moveStructure(currentStructure, currentStructure.map.positionX, currentStructure.map.positionY+1, true);
                }
                else if (e.keyCode == '37') {
                    // left arrow
                    moveStructure(currentStructure, currentStructure.map.positionX-1, currentStructure.map.positionY, true);
                }
                else if (e.keyCode == '39') {
                    // right arrow
                    moveStructure(currentStructure, currentStructure.map.positionX+1, currentStructure.map.positionY, true);
                }
            }
        }

        /*
        * Store functions
        */

       const getNextUpdate = (type, structure, index = 0) => {
            let currentStructure = userstate?.buildings[structure];
            let currentStructureLevel = currentStructure?.units[index]?.currentLevel ? currentStructure.units[index].currentLevel : 0;
            let maxStructureLevel = availableBuildings[type][structure]["max-level"];
    
            if(structure != "townhall"){
                if(structure != "builder-hut"){
                    if(currentStructureLevel < maxStructureLevel){
                        let nextStructure = availableBuildings[type][structure]?.level[currentStructureLevel+1];
                        return { structure: nextStructure, currentLevel: currentStructureLevel+1 }; // Any building
                    }
                }else {
                    let nextStructure = availableBuildings[type][structure]?.price[index+1];
                    return { structure: { price: nextStructure, token: "gold" }, currentLevel: 1 }; // Builder-hut
                }
                
            }else {
                let nextStructure = availableBuildings[type][structure]?.level[currentStructureLevel+1];
                if(nextStructure){
                    return { structure: nextStructure, currentLevel: currentStructureLevel+1 }; // Townhall
                }
            }

            return false;
       }

       const getNextBuy = (type, structure, index = 0) => {
            let currentStructureLevel = 0;
            let maxStructureLevel = availableBuildings[type][structure]["max-level"];
    
            if(structure != "townhall"){
                if(structure != "builder-hut"){
                    if(currentStructureLevel < maxStructureLevel){
                        let nextStructure = availableBuildings[type][structure]?.level[currentStructureLevel+1];
                        return { structure: nextStructure, currentLevel: currentStructureLevel+1 }; // Any building
                    }
                }else {
                    let nextStructure = availableBuildings[type][structure]?.price[index+1];
                    return { structure: { price: nextStructure, token: "gold" }, currentLevel: 1 }; // Builder-hut
                }
                
            }else {
                let nextStructure = availableBuildings[type][structure]?.level[currentStructureLevel+1];
                return { structure: nextStructure, currentLevel: currentStructureLevel+1 }; // Townhall
            }

            return false;
       }


       const checkUpdate = (building) => {
            if(building?.structure?.token == "gold"){
                if(userstate?.currentGold >= building?.structure?.price) return true;
            }
            else if(building?.structure?.token == "elixir"){
                if(userstate?.currentElixir >= building?.structure?.price) return true;
            }

            return false;
       } 

       const buyStructure = (name, building) => {

            

            if(checkUpdate(building)){
                userstate?.addStructure(name, building);
            }
            
       }

       const updateStructure = (name, building, key) => {

            if(checkUpdate(building)){
                userstate?.updateStructure(name, building, key);
                if(name == 'townhall')  Object.assign(availableBuildings, getAvailableBuildings());
            }
       }

       /*
       * Clock time
       */
        const getClockTime = computed(() => {
            //return clock;
        });

  
        return {
            matrix,
            townhall,
            mine,
            getAvailableBuildings,
            availableBuildings,
            setEditMode,
            addStructure,
            removeStructure,
            moveStructure,
            saveStructurePosition,
            keyPress,
            datagame,
            currentLevel,
            userstate,
            getNextUpdate,
            checkUpdate,
            buyStructure,
            getNextBuy,
            updateStructure,
            getClockTime
        }
    },
    mounted() {
	    window.addEventListener('keydown', this.keyPress);
    }
}
</script>

<style lang="css">

    .dashboard {
        display: flex;
        width: 100%;
    }

    button.notenough {
        color: red;
    }
    button.notenough[disabled],
    button[disabled] {
        color: white;
    }

    .left-data, .right-data {
        width: 50%;
    }

    .world-rows {
        display: flex;
    }

    .world-space[data-value="1"] {
        background: #fff;
        border: 1px solid #fff;
    }
    .world-space[data-value="2"] {
        background: red;
        border: 1px solid #fff;
    }
        .world-space[data-value="3"] {
        background: blue;
        border: 1px solid #fff;
    }

    .world-space {
        display: block;
        color: #888;
        border: 1px solid #aaa;
        width: 12px;
        height: 12px;
    }

</style>