import { Component, Switch, Match, createEffect, createSignal, For} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button } from 'solid-bootstrap'
import {useForceStore} from './ForceStore';
import {useActiveForceStore} from './ActiveForceStore';
import Force from '../entities/Force'
import {factions} from '../helpers/ManifestHelpers'
import manifest from '../data/manifest.json'


function NewFactionDetails(){

    const activeForceStore = useActiveForceStore()

    const handleSetForceName = (e) => { // TODO add validation to make sure name doesn't match exiting force.
        let value = e.target.value
        activeForceStore.setForce({
            ...activeForceStore.getForce(),
            name: value
        })
    }

    const handleSetForceFaction = (e) => {
        let value = e.target.value
        if (value === "null") value = null
        activeForceStore.setForce({
            ...activeForceStore.getForce(),
            faction: value,
            availabilityEra: null,
            roster: []
        })
    }

    const handleSetAvailabilityEra = (e) => {
        let value = e.target.value
        if (value === "null") value = null
        activeForceStore.setForce({
            ...activeForceStore.getForce(),
            availabilityEra: value
        })
    }

    const availabilityEraOptions = () => {
        if(!isFactionSet()){
            return []
        }

        let faction = activeForceStore.getForce().faction
        for(const [techBase, data] of Object.entries(manifest)){
            if(faction in data){
                return Object.keys(data[faction])
            }
        }
    }

    const isFactionSet = () => {
        return activeForceStore.getForce() !== null &&
        activeForceStore.getForce() !== undefined &&
        activeForceStore.getForce().faction !== null
    }

    const disableEraSelect = () => {
        return !isFactionSet()
    }

    const disableSubmit = () => {
        let force = activeForceStore.getForce()
        return !(
            activeForceStore.getForce() !== null &&
            activeForceStore.getForce() !== undefined  &&
            activeForceStore.getForce().faction !== null &&
            activeForceStore.getForce().faction !== undefined &&
            activeForceStore.getForce().name !== null &&
            activeForceStore.getForce().name !== undefined &&
            activeForceStore.getForce().name !== "" &&
            activeForceStore.getForce().availabilityEra !== undefined &&
            activeForceStore.getForce().availabilityEra !== null
        )
    }

    const handleCreateForce = () =>{
        // todo: add additional fields
        activeForceStore.setForce({
            ...activeForceStore.getForce(),
        })

        activeForceStore.saveActiveForce()

        activeForceStore.setForceType("existing")
    }


    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group class="mb-3" as={Col}>
                        <Form.Label>Force Name</Form.Label>
                        <Form.Control type="text" placeholder="My Force"  onKeyUp={handleSetForceName}/>
                    </Form.Group>
                </Col>
                <Form.Group as={Col} class="mb-3">
                    <Form.Label>
                        Faction
                    </Form.Label>
                    <Form.Select onChange={handleSetForceFaction}>
                        <option value={null}></option>
                        <For each={factions}>{(faction, i) =>
                            <option value={faction}>{faction}</option>
                        }</For>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} class="mb-3">
                    <Form.Label>
                        Availability Era
                    </Form.Label>
                    <Form.Select disabled={disableEraSelect()} onChange={handleSetAvailabilityEra}>
                        <option value={null}></option>
                        <For each={availabilityEraOptions()}>{(era, i) =>
                            <option value={era}>{era}</option>
                        }</For>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row>
                <Col></Col>
                <Col>
                    <Button  variant={disableSubmit() ? "outline-secondary": "primary"} disabled={disableSubmit()} onClick={handleCreateForce}>Create Force</Button>
                </Col>
                <Col></Col>
            </Row>
        </Form>
    )
}

export default NewFactionDetails