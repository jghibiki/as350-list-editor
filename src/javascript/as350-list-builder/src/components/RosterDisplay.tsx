import { Component, Switch, Match, createEffect, createSignal, For} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button, Stack, Tab, Tabs, Card, Pagination } from 'solid-bootstrap'
import {useActiveForceStore} from './ActiveForceStore'
import {lookupUnit} from '../helpers/ManifestHelpers'
import {UnitDisplay} from './UnitDisplay'

export function RosterDisplay(){
    const activeForceStore = useActiveForceStore()
    const [reason, setReason] = createSignal("")
    const [roster, setRoster] = createSignal(null)

    const calculatePoints = (unit) => {
        let delta = 4 - unit.pilotSkill
        let basePV = unit.BFPointValue

        if(delta === 0){
            return basePV
        }
        else if(delta < 0){ // worse skill, reduce PV
            let adjustment = 0
            if(basePV <= 14){
                adjustment = 1
            }
            else{
                let adjustedPV = basePV - 14
                adjustment = Math.ceil(adjustedPV / 10) + 1
            }
            let calcd = basePV - (adjustment * Math.abs(delta))
            return Math.max(calcd,1)
        }
        else if(delta > 0){ // better skill increase PV
            let adjustment = 0
            if(basePV <= 7){
                adjustment = 1
            }
            else{
                let adjustedPV = basePV - 7
                adjustment = Math.ceil(adjustedPV / 5) + 1
            }

            let calcd = basePV + (adjustment * Math.abs(delta))
            return Math.max(calcd,1)
        }
    }

    createEffect( () => {
        let r =  activeForceStore.getForce().roster

        let updatedRoster = r.map((unit) => {
            let u = {
                ...unit,
                calculatedPoints: calculatePoints(unit)
            }
            return u
        })

        setRoster([...updatedRoster])
    })

    const pointTotal = () => {
        return roster().reduce(
            (acc, value) => acc + value.calculatedPoints,
            0
        )
    }

    const percentPoints = () => {
        return Math.ceil(pointTotal() / 350 * 100)
    }

    const validationStatus = () => {
        let reason = ""

        let pointCheck = pointTotal() <= 350
        if(!pointCheck){
            setReason("Point total is greater than 350.")
        }

        let unitCountCheck = roster() !== null && roster().length <= 16
        if(!unitCountCheck){
            setReason("A roster may consist of no more than 16 units.")
        }


        let mechCountCheck = (() =>{
            if(roster() === null) return false
            let mechs =  roster().filter(
                unit => {
                    let t = unit.BFType
                    return t === "BM" || t === "PM" || t === "IM"
                }
            )
            return mechs.length <= 8
        })()
        if(!mechCountCheck){
            setReason("A roster may consist of no more than 8 of any Mech Type (BattleMech, IndustrialMech, ProtoMech).")
        }

        let combatVehicleCountCheck = (() =>{
            if(roster() === null) return false
            let vehicles =  roster().filter(
                unit => {
                    let t = unit.BFType
                    return t === "CV"
                }
            )
            return vehicles.length <= 8
        })()
        if(!combatVehicleCountCheck){
            setReason("A roster may consist of no more than 8 Combat Vehicles.")
        }

        let infantryCountCheck = (() =>{
            if(roster() === null) return false
            let infantry =  roster().filter(
                unit => {
                    let t = unit.BFType
                    return t === "CI" || t === "BA"
                }
            )
            return infantry.length <= 5
        })()
        if(!infantryCountCheck){
            setReason("A roster may consist of no more than 5 Infantry Units of Battle Armor.")
        }

        let protoMechCountCheck = (() =>{
            if(roster() === null) return false
            let protoMechs =  roster().filter(
                unit => {
                    let t = unit.BFType
                    return t === "PM"
                }
            )
            return protoMechs.length <= 5
        })()
        if(!protoMechCountCheck){
            setReason("A roster may consist of no more than 5 ProtoMechs.")
        }

        let artCountCheck = (() =>{
            if(roster() === null) return false
            let sum =  roster().map(
                unit => {
                    let abilities = unit.BFAbilities || ""
                    let sum = (
                        abilities
                            .toLowerCase()
                            .split(",")
                            .filter(a=> a.startsWith("art"))
                            .reduce(
                                (acc, value) => acc + (+value.split("-")[1]),
                                0
                            )
                    )
                    return sum
                }
            ).reduce(
                (acc, value) => acc + value,
                0
            )
            return sum <= 2
        })()
        if(!artCountCheck){
            setReason("An army can only have an ART combined value of 2. Either 2 units with ART-1, or one unit with an ART-2.")
        }

        let jmpsCountCheck = (() =>{
            if(roster() === null) return false
            let sum =  roster().map(
                unit => {
                    let abilities = unit.BFAbilities || ""
                    let sum = (
                        abilities
                            .toLowerCase()
                            .split(",")
                            .filter(a=> a.startsWith("jmps"))
                            .reduce(
                                (acc, value) => acc + (+value.replace("jmps","")),
                                0
                            )
                    )
                    return sum
                }
            ).reduce(
                (acc, value) => acc + value,
                0
            )
            return sum <= 2
        })()
        if(!jmpsCountCheck){
            setReason("An army can only have a JMPS combined value of 2. Either 2 units with JMPS1, or one unit with JMPS2")
        }

        /*
            TODO:
            - chassis limit
            - variant limit
            - proto mech rule of 2
        */


       let valid = (
           pointCheck &&
           unitCountCheck &&
           mechCountCheck &&
           combatVehicleCountCheck &&
           infantryCountCheck &&
           protoMechCountCheck &&
           artCountCheck &&
           jmpsCountCheck

       )
       if(valid){
            setReason("")
       }
       activeForceStore.setListValid(valid)

       return valid
    }

    const handleRemoveUnit= (index) => {
        let force = activeForceStore.getForce()
        let newForce = {
            ...force
        }
        newForce.roster.splice(index, 1)
        activeForceStore.setForce(newForce)
        activeForceStore.setHasUnsavedEdits(true)
        }

    const handleSelectPilotSkill = (index) => (e) => {
        let force = activeForceStore.getForce()
        let newForce = {...force}
        let unit = newForce.roster[index]
        unit.pilotSkill = e.target.value
        newForce.roster[index] = unit
        activeForceStore.setForce(newForce)
        activeForceStore.setHasUnsavedEdits(true)
    }

    return (
        <>
            <Switch>
                <Match when={roster() === null || roster().length === 0}>
                    No units added yet.
                </Match>
                <Match when={roster().length > 0}>
                    <p>
                        Point Total: {pointTotal()} ({percentPoints()}%) / 350
                    </p>
                    <p>
                        <span>Validation Status: </span>
                        <Switch>
                            <Match when={validationStatus()}>
                                Valid
                            </Match>
                            <Match when={!validationStatus()}>
                                <span>Invalid</span>
                                <p style={{"color": "red"}}>
                                    {reason()}
                                </p>
                            </Match>
                        </Switch>
                    </p>
                    <For each={roster()}>{(unit, i) =>
                        <Row style={{"margin-top": "20px"}}>
                            <Col>
                                <UnitDisplay
                                    unit={unit}
                                    pointsField={"calculatedPoints"}
                                    header={
                                        <Button
                                            onClick={[handleRemoveUnit, i]}
                                            style={{"float": "right"}}
                                            className="btn-outline-danger btn"
                                        >
                                            ❌
                                        </Button>
                                    }

                                    >
                                    <Row>
                                        <Col>
                                            <Form.Group>

                                                <Form.Label>
                                                    Pilot Skill
                                                </Form.Label>
                                                <Form.Select value={unit.pilotSkill} onChange={handleSelectPilotSkill(i())}>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                </Form.Select>

                                            </Form.Group>
                                        </Col>
                                     </Row>
                                </UnitDisplay>
                            </Col>
                        </Row>
                    }</For>
                </Match>
            </Switch>
        </>
    )
}