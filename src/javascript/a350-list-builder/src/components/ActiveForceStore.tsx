import { createSignal, createContext, useContext } from "solid-js";
import Force from '../entities/Force'
import {createStorage} from '@solid-primitives/storage'

const ActiveForceStoreContext = createContext()

export function ActiveForceStoreProvider(props){

    const [localStore, setLocalStore, {
        remove,
        clear,
        toJSON
    }] = createStorage()
    const [activeForce, setActiveForce] = createSignal<Force>(null)
    const [forceType, setForceType] = createSignal<string>(null)
    const [hasUnsavedEdits, setHasUnsavedEdits] = createSignal<bool>(false)
    const [listValid, setListValid] = createSignal(false)

    const savedForces = () => JSON.parse(localStore.savedForces) as Array<Force>


    const saveActiveForce = () => {
        let savedForces = null

        if("savedForces" in localStore){
            let index = localStore.savedForces.map(el => el.name).indexOf()
            if(index === -1){ // will need to insert
                savedForces = [
                    ...localStore.savedForces,
                    activeForce()
                ]
            }
            else { // will need to update
                savedForces = localStore.savedForces
                savedForces[index] = activeForce()
            }
        }
        else {
            savedForces = [activeForce()]
        }

        setLocalStore("savedForces", JSON.stringify(savedForces))
        setHasUnsavedEdits(false)
    }

    const activeForceManager = {
        getForce: activeForce,
        setForce: setActiveForce,
        getForceType: forceType,
        setForceType: setForceType,
        hasUnsavedEdits: hasUnsavedEdits,
        setHasUnsavedEdits: setHasUnsavedEdits,
        listForces: savedForces,
        saveActiveForce: saveActiveForce,
        listValid: listValid,
        setListValid: setListValid
    }

    return (
        <ActiveForceStoreContext.Provider value={activeForceManager}>
            {props.children}
        </ActiveForceStoreContext.Provider>
    )
}

export function useActiveForceStore() { return useContext(ActiveForceStoreContext)}
