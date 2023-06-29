import { createSignal, createContext, useContext, batch } from "solid-js";
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
        let savedForces = JSON.parse(localStore.savedForces)

        if(savedForces != null){
            let index = savedForces.map(el => el.name).indexOf(activeForce().name)
            if(index === -1){ // will need to insert
                savedForces = [
                    ...savedForces,
                    activeForce()
                ]
            }
            else { // will need to update
                savedForces = savedForces
                savedForces[index] = activeForce()
            }
        }
        else {
            savedForces = [activeForce()]
        }

        setLocalStore("savedForces", JSON.stringify(savedForces))
        setHasUnsavedEdits(false)
    }

    const deleteActiveForce = () => {
        let savedForces = JSON.parse(localStore.savedForces)

        if(savedForces != null){
            let index = savedForces.map(el => el.name).indexOf(activeForce().name)
            if(index !== -1){ // we found the active Force
                let updated = [
                    ...savedForces
                ]
                updated.splice(index, 1)
                savedForces = updated
            }
        }

        batch(()=>{
            setLocalStore("savedForces", JSON.stringify(savedForces))
            setHasUnsavedEdits(false)
            setActiveForce(null)
            setForceType(null)
        })
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
        setListValid: setListValid,
        deleteActiveForce: deleteActiveForce,
    }

    return (
        <ActiveForceStoreContext.Provider value={activeForceManager}>
            {props.children}
        </ActiveForceStoreContext.Provider>
    )
}

export function useActiveForceStore() { return useContext(ActiveForceStoreContext)}
