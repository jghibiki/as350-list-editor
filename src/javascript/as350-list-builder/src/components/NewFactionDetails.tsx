import { Component, Switch, Match, createEffect, createSignal, For, batch} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button, InputGroup  } from 'solid-bootstrap'
import {useForceStore} from './ForceStore';
import {useActiveForceStore} from './ActiveForceStore';
import Force from '../entities/Force'
import {factions} from '../helpers/ManifestHelpers'
import manifest from '../data/manifest.json'


function NewFactionDetails(){

    const activeForceStore = useActiveForceStore()
    const [forceName, setForceName] = createSignal<string>(null)
    const [faction, setFaction] = createSignal<string>(null)
    const [era, setEra] = createSignal<string>(null)
    const [isValid, setIsValid] = createSignal(false)
    const [forceNameInvalid, setForceNameInvalid] = createSignal(false)
    const [errorMessage, setErrorMessage] = createSignal<string>(null)

    createEffect(() =>{
        // TODO add validation logic for force name
        activeForceStore.getForce()


        let fieldsSet = (
            faction() !== null &&
            faction() !== undefined &&
            forceName() !== null &&
            forceName() !== undefined &&
            forceName() !== "" &&
            era() !== undefined &&
            era() !== null
        )

        let forceNames = activeForceStore.listForces().map(el=>el.name)
        let nameIndex = forceNames.indexOf(forceName())

        let nameValid = true
        let message = ""
        if(nameIndex !== -1){
            nameValid = false
            message = "A force with this name already exists."
        }
        if(forceName() === null || forceName() === ""){
            nameValid = false
            message = "Please provide a force name."
        }

        batch(()=>{
            setIsValid(
                fieldsSet && nameValid
            )
            setErrorMessage(message)
            setForceNameInvalid(!nameValid)
        })
    })


    const handleSetForceName = (e) => { // TODO add validation to make sure name doesn't match exiting force.
        let value = e.target.value
        setForceName(value)
    }

    const handleSetForceFaction = (e) => {
        let value = e.target.value
        if (value === "null") value = null
        setFaction(value)
    }

    const handleSetAvailabilityEra = (e) => {
        let value = e.target.value
        if (value === "null") value = null
        setEra(value)
    }

    const availabilityEraOptions = () => {
        if(disableEraSelect()){
            return []
        }

        for(const [techBase, data] of Object.entries(manifest)){
            if(faction() in data){
                return Object.keys(data[faction()])
            }
        }
    }

    const disableEraSelect = () => {
        return faction() === null
    }

    const handleCreateForce = () =>{
        batch(()=>{
            activeForceStore.setForce({
                ...activeForceStore.getForce(),
                availabilityEra: era(),
                name: forceName(),
                faction: faction(),
                roster: []
            })

            activeForceStore.saveActiveForce()
            activeForceStore.setForceType("existing")
        })
    }


    return (
        <Form onSubmit={(e)=>{e.preventDefault()}}>
            <Row>
                <Col>
                    <Form.Group class="mb-3" as={Col}>
                        <Form.Label>Force Name</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control type="text" placeholder="My Force"  onKeyUp={handleSetForceName} isInvalid={forceNameInvalid()}/>
                            <Form.Control.Feedback type="invalid">
                                {errorMessage()}
                            </Form.Control.Feedback>
                        </InputGroup>
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
                    <Button  variant={!isValid() ? "outline-secondary": "primary"} disabled={!isValid()} onClick={handleCreateForce}>Create Force</Button>
                </Col>
                <Col></Col>
            </Row>
        </Form>
    )
}

export default NewFactionDetails