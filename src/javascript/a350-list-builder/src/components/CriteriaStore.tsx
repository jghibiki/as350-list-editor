import { createSignal, createContext, useContext } from "solid-js";
import {createStorage} from '@solid-primitives/storage'

const CriteriaStoreContext = createContext()

export function CriteriaStoreProvider(props){
    const [criteria, setCriteria] = createSignal([])

    const criterionManager = {
        get: criteria,
        set: setCriteria,
    }

    return (
        <CriteriaStoreContext.Provider value={criterionManager}>
            {props.children}
        </CriteriaStoreContext.Provider>
    )
}

export function useCriteriaStore() { return useContext(CriteriaStoreContext)}
