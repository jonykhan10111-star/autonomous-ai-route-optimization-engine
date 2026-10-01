/**
 * AUTONOMOUS AI ROUTE OPTIMIZATION & DELIVERY SIMULATOR ENGINE
 * Paradigm: Pure Functional Immutability, Graph Theory & Heuristic AI
 * Specification: ECMAScript Modern Standard (ES Modules) - 100% Executable
 * Developer: Jony Khan
 */

//============================================
// 1. Graph Infrastructure & Adjacency Mapping
//============================================
const rawMeadowfieldRoads = [
    "Alice's House - Bob's House",
    "Alice's House - Cabin",
    "Alice's House - Post Office",
    "Bob's House - Town Hall",
    "Daria's House - Erine's House",
    "Darina's house - Town Hall",
    "Erine's House - Grete's House",
    "Grete's House - Farm",
    "Greate,s House - Shop",
    "Marketplace - Post Office",
    "Marketplace - Farm",
    "Marketplace - Shop",
    "Marketplace - Town Hall",
    "Shop - Town Hall"
];

export function buildGraph(edges) {
    const graph = Object.create(null); //Prototype-less secure dictionary lookup
    function addEdge(from, to) {
        if (graph[from] === undefined) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }
    for (const edge of edges) {
        const [from, to] = edge.split("-").map(part => part.trim());
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

export const roadGraph = buildGraph(rawMeadowfieldRoads);

//===========================================
// 2. Strict Deep Freeze Configuration Engine
//===========================================
export function deepFreeze(object){
    const propNames = Reflect.ownKeys(object);
    for (const name of propNames) {
        const value = object[name];
        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}

//======================================================
// 3. Immutable State Container & Simulation Transitions
//======================================================
export class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
        deepFreeze(this); //Lock current state to guarantee total immutability
    }
    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        }
        // Update parcel tracking states without mutating state invariants
        const updateParcels = this.parcels.map(p => {
            if (p.place !== this.place)
                return p;
            return {place:destination, address: p.address };
        }).filter(p => p.address !== destination); // Drop delivered payload instances

        return new VillageState(destination, updateParcels);
    }

    // Generates randomized courier parcels across the topology grid
    static random(parcelCount = 5) {
        const parcels = [];
        const places = Object.keys(roadGraph);
        for (let i = 0; i < parcelCount; i++) {
            const address = places[Math.floor(Math.random() * places.length)];
            let place;
            do {
                place = places[Math.floor(Math.random() * places.length)];
            } while (place === address);
            parcels.push({place, address});
        }
        return new VillageState("Post Office", parcels);
    }
}

//============================================================
// 4. Graph Search Pathfinder Subsystem (Breadth-First Search)
//============================================================
export function findRoute (graph, from, to) {
    const workList = [{ at:from, route: [] }];
    for (let i = 0; i < workList.length; i++) {
        const { at, route } = workList[i];
        for(const place of graph[at]) {
            if (place === to)return route.concat(place);//Shortest path confirmed
    
            if (!workList.some(w => w.at === place)){
                workList.push({ at: place, route: route.concat(place) });
            }
        }
    }
}

//==========================================
// 5. Goal-Oriented Heuristic AI Robot Brain
//==========================================
export function goalOrientedRobot ({ place, parcels }, route){
    if(route.length === 0) {
        const parcel = parcels [0];
        if(parcel.place !== place) {
            // Goal 1: Target nearest parcel allocation point for pickup
            route = findRoute(roadGraph, place, parcel.place);
        }else{
            // Goal 2: Target parcel shipment drop boundary
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return { direction: route[0], memory: route.slice(1) };
}

//======================================
// 6. Central Visualized Simulation Loop
//======================================

export function runRobotEngine(state, robotBrain, memory) {
    console.log("===============================================================");
    console.log(`🤖 SIMULATOR ENGAGED: Starting route from [${state.place}]`);
    console.log(`📦 Active Shipment Payload Count: ${state.parcels.length}`);
    console.log("===============================================================\n")

    let turn = 0;
    while (state.parcels.length > 0) {
        const action = robotBrain(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        turn++;

        // Pro-visual text animation simulation effect trace mapping loop
        const parcelMapTrace = state.parcels.map(p => `${p.place}🪧➡️🏠${p.address}`).join(" | ");
        console.log(`[Turn ${String(turn).padStart(2, '0')}] 🛸Courier Teleported to: [${state.place}]`);
        if(parcelMapTrace) console.log(`           📦Parcel Manifest Matrix: [ ${parcelMapTrace} ]`);
        console.log("--------------------------------------------------------------------------------------");
    }

    console.log("\n===============================================================");
    console.log(`🏴 MISSION ACCOMPLISHED: Final Operations Turn Count: [ ${turn} ] Steps`);
    console.log("===============================================================\n");
    return turn;
}

//===============================================
// 7. Core Sandbox Diagnostic Pipeline Executions
//===============================================
const productionWorldSnapshot = VillageState.random(5); //Spawn 5 dynamic test packages
runRobotEngine(productionWorldSnapshot, goalOrientedRobot, []);