import manifest from '../data/manifest.json'
import unitData from '../data/unit_data.json'
import Fuse from 'fuse.js'

const factionNamesToFilter = [
    "Inner Sphere General",
    "IS Clan General",
    "HW Clan General",
    "Periphery General",
    "Unique"
]

export const factions = [
    ... new Set(
        Object.keys(manifest).map((techBase) => {
            return Object.keys(manifest[techBase])
        }).flat()
    )
].filter(e => factionNamesToFilter.indexOf(e) == -1)


export const techBaseToFaction = {
    ... Object.keys(manifest).map(
        (techBase) => {
            return { techBase: Object.keys(manifest[techBase]) }
        }
    )
}


export const techBaseToGeneralList = {
    "Inner Sphere" : "Inner Sphere General",
    "IS Clan": "IS Clan General",
    "HW Clan": "HW Clan General",
    "Periphery": "Periphery General"
}


function findUnitsByFactionAndEra(faction, availabilityEra){
    let factionTechBase = null
    let units = []
    for(let [techBase, data] of Object.entries(manifest)){
        if(faction in data){
            for(let [era, eraData] of Object.entries(data[faction])){
                if(availabilityEra === era){
                    factionTechBase = techBase
                    units = units.concat(eraData)
                }
            }
        }
    }

    // find supplemental units too
    if(factionTechBase != null){
        let supplementalList = techBaseToGeneralList[factionTechBase]
        let supplementalEraData = manifest[factionTechBase][supplementalList] || {}
        for(let [era, eraData] of Object.entries(supplementalEraData)){
            if(availabilityEra === era){
                units = units.concat(eraData)
            }
        }
    }

    units = [ ... new Set(units)]

    return units
}

function lookupUnitMetadata(units){
    return units.map(
        (unit) => {
        if(unit.unit_name in unitData){
            return unitData[unit.unit_name]
        }
        return null
    }).filter((el) => el !== null)
}

function filterInvalidUnits(units){
    return units.filter((unit) => {
        if(unit.Rules.toLowerCase() === "experimental" || unit.Rules.toLowerCase() === "unknown"){
            return false
        }

        if(unit.BFAbilities !== null && unit.BFAbilities.toLowerCase().includes("DRO")){
            return false
        }

        return true
    })
}

function filterUnits(units, searchCriteria){
    for(let criterion of searchCriteria){
        if(criterion.filterType === "range"){
            units = units.filter(
                (unit) => {
                let value = unit[criterion.field]
                return value >= criterion.lowerBound && value <= criterion.upperBound
            })
        }
        else if(criterion.filterType === "select"){
            units = units.filter(
                (unit) => {
                let value = unit[criterion.field] || ""
                return criterion.selected === value.toString()
            })
        }
        else if(criterion.filterType === "fuzzy"){
            if(criterion.query !== "*"){
                // only use fuzzy search if the query isn't *

                let fuse = new Fuse(units, {
                    keys: [criterion.field]
                })
                units = fuse.search(
                    criterion.query
                ).map(el => el.item)
            }
        }
    }

    return units
}

export function searchUnits(faction, availabilityEra, searchCriteria){

    let factionUnits = findUnitsByFactionAndEra(faction, availabilityEra)
    let unitsWithMetadata = lookupUnitMetadata(factionUnits)
    let filteredUnits = filterInvalidUnits(unitsWithMetadata)
    let searchResults = filterUnits(filteredUnits, searchCriteria)

    return searchResults
}

export function lookupUnit(unitName){
    for(let unit of Object.values(unitData)){
        if(unit.Name === unitName){
            return unit
        }
    }
}