import { Component, Switch, Match, createEffect, createSignal, For, mergeProps} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button, Stack, Tab, Tabs, Card } from 'solid-bootstrap'
import {useCriteriaStore} from './CriteriaStore'

export const criteriaOptions = [
    ["class", "Class"],
    ["variant", "Variant"],
    ["tonnage", "Tonnage"],
    ["pointValue", "PointValue"],
    ["type", "Type"],
    ["size", "Size"],
    ["baseMove", "Base Move"],
    ["jumpMove", "Jump Move"],
    ["tmm", "TMM"],
    ["armor", "Armor"],
    ["structure", "Structure"],
    ["shortDamage", "Short Range Damage"],
    ["mediumDamage"," Medium Range Damage"],
    ["longDamage", "Long Range Damage"],
    ["extremeDamage", "Extreme Range Damage"],
    ["overheat", "Overheat"],
    ["abilities", "Abilities"]
]

export function allCriteriaValid(criteria){

    let validationState =  criteria.reduce(
        (acc, value) => {
            let valid = false
            if(value.filterType === "range"){
                valid = (
                    value.upperBound !== undefined &&
                    value.upperBound !== null  &&
                    value.upperBound !== ""  &&
                    value.lowerBound !== undefined &&
                    value.lowerBound !== null &&
                    value.lowerBound !== ""
                )
            }
            else if(value.filterType === "select"){
                valid = (
                    value.selected !== undefined &&
                    value.selected !== null
                )
            }
            else if(value.filterType === "fuzzy"){
                valid = (
                    value.query !== undefined &&
                    value.query !== ""
                )
            }
            return valid && acc
        },
        true
    )

    return validationState
}

export function CriteriaEditor(props){
    const criterion = props.criterion

    const criteriaStore = useCriteriaStore()

    let config = criteriaStore.get()[criterion]

    const handleRemoveCriterion = (criterion) => {
        let temp = {...criteriaStore.get()}
        delete temp[criterion]
        criteriaStore.set(temp)
    }

    const handleUpdateRange = (params, event) => {
        let [criterion, bound] = params
        let temp = {...criteriaStore.get()}
        temp[criterion][bound] = event.target.value
        criteriaStore.set(temp)
    }

    const handleUpdateFuzzy = (criterion, event) =>{
        let temp = {...criteriaStore.get()}
        temp[criterion].query = event.target.value
        criteriaStore.set(temp)
    }

    const handleUpdateSelected = (criterion, event) =>{
        let temp = {...criteriaStore.get()}
        temp[criterion].selected = event.target.value
        criteriaStore.set(temp)
    }


    if(config === undefined){
        return <span></span>
    }

    if(config.filterType === "range"){
        return (
            <fieldset className="border p-3" >
                <legend className="w-auto float-none lead">{config.label}</legend>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Minimum</Form.Label>
                            <Form.Control value={config.lowerBound} onInput={[handleUpdateRange, [criterion, "lowerBound"]]}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Maximum</Form.Label>
                            <Form.Control value={config.upperBound} onInput={[handleUpdateRange, [criterion, "upperBound"]]}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{"text-align": "right"}}>
                    <Col>
                        <Button onClick={[handleRemoveCriterion, criterion]}>Remove Criterion</Button>
                    </Col>
                </Row>
            </fieldset>
        )
    }
    else if(config.filterType === "select"){
        return (
            <fieldset className="border p-3" >
                <legend className="w-auto float-none lead">{config.label}</legend>
                <Form.Group className="mb-3">
                    <Form.Label>Option</Form.Label>
                    <Form.Select onChange={[handleUpdateSelected, criterion]}>
                            <option value={null}></option>
                        <For each={config.options}>{(option, i) =>
                            <option value={option.value}>{option.name}</option>
                        }</For>
                    </Form.Select>
                </Form.Group>
                <Row style={{"text-align": "right"}}>
                    <Col>
                        <Button onClick={[handleRemoveCriterion, criterion]}>Remove Criterion</Button>
                    </Col>
                </Row>
            </fieldset>
        )
    }
    else if(config.filterType === "fuzzy"){
        return (
            <fieldset className="border p-3" >
                <legend className="w-auto float-none lead">{config.label}</legend>
                <Form.Group className="mb-3">
                    <Form.Label>Search Query</Form.Label>
                    {/*TODO add validation for citeria fields*/}
                    <Form.Control onInput={[handleUpdateFuzzy, criterion]} />
                </Form.Group>
                <Row style={{"text-align": "right"}}>
                    <Col>
                        <Button onClick={[handleRemoveCriterion, criterion]}>Remove Criterion</Button>
                    </Col>
                </Row>
            </fieldset>
        )
    }

    return (<span></span>)
}

export function AddCriteriaButton(){
    const criteriaStore = useCriteriaStore()

    const addCriteria = (type) => {
        if(type in criteriaStore.get()){
            return
        }

        let newCriteria
        if(type === "tonnage"){
            newCriteria = {
                filterType: "range",
                label: "Tonnage",
                field: "Tonnage",
                upperBound: 999,
                lowerBound: 0
            }
        }
        else if(type === "pointValue"){
            newCriteria = {
                filterType: "range",
                label: "Point Value",
                field: "BFPointValue",
                upperBound: 999,
                lowerBound: 0
            }
        }
        else if(type === "type"){
            newCriteria = {
                filterType: "select",
                label: "Type",
                field: "BFType",
                selected: null,
                options: [
                    {name:"BattleMech (BM)", value: "BM"},
                    {name:"IndustrialMech (IM)", value:"IM"},
                    {name:"ProtoMech (PM)", value:"PM"},
                    {name:"Combat Vehicle (CV)", value:"CV"},
                    {name:"Conventional Infantry (CI)", value:"CI"},
                    {name:"Battle Armor (BA)", value:"BA"},
                ]
            }
        }
        else if(type === "size"){
            newCriteria = {
                filterType: "select",
                label: "Size",
                field: "BFSize",
                selected: null,
                options: [
                    {name:"Light", value: "1"},
                    {name:"Medium", value:"2"},
                    {name:"Heavy", value:"3"},
                    {name:"Assault", value:"4"}
                ]
            }
        }
        else if(type === "baseMove"){
            newCriteria = {
                filterType: "range",
                label: "Base Move",
                parser: (val) => val.split("/")[0].replaceAll("\"", ""), // TODO handle parser calls
                field: "BFPointValue",
                upperBound: 30,
                lowerBound: 0
            }
        }
        else if(type === "jumpMove"){
            newCriteria = {
                filterType: "range",
                label: "Jump Move",
                parser: (val) => {
                    let tokens = val.replaceAll("\"", "").replaceAll("j", "").split("/")
                    if(tokens.length >= 1){
                        return tokens[1]
                    }
                    return null
                },
                field: "BFPointValue",
                upperBound: 30,
                lowerBound: 0
            }
        }
        else if(type === "tmm"){
            newCriteria = {
                filterType: "range",
                label: "TMM",
                field: "BFTMM",
                upperBound: 12,
                lowerBound: 0
            }
        }
        else if(type === "armor"){
            newCriteria = {
                filterType: "range",
                label: "Armor",
                field: "BFArmor",
                upperBound: 30,
                lowerBound: 0
            }
        }
        else if(type === "structure"){
            newCriteria = {
                filterType: "range",
                label: "Type",
                field: "BFStructure",
                upperBound: 60,
                lowerBound: 0
            }
        }
        else if(type === "shortDamage"){
            newCriteria = {
                filterType: "range",
                label: "Short Range Damage",
                field: "BFDamageShort",
                upperBound: 20,
                lowerBound: 0
            }
        }
        else if(type === "mediumDamage"){
            newCriteria = {
                filterType: "range",
                label: "Medium Range Damage",
                field: "BFDamageMedium",
                upperBound: 20,
                lowerBound: 0
            }
        }
        else if(type === "longDamage"){
            newCriteria = {
                filterType: "range",
                label: "Long Range Damage",
                field: "BFDamageLong",
                upperBound: 20,
                lowerBound: 0
            }
        }
        else if(type === "extremeDamage"){
            newCriteria = {
                filterType: "range",
                label: "Extreme Range Damage",
                field: "BFDamageExtreme",
                upperBound: 20,
                lowerBound: 0
            }
        }
        else if(type === "overheat"){
            newCriteria = {
                filterType: "range",
                field: "BFOverheat",
                label: "Overheat",
                upperBound: 20,
                lowerBound: 0
            }
        }
        else if(type === "abilities"){
            newCriteria = {
                filterType: "fuzzy",
                label: "Abilities",
                field: "BFAbilities",
                query: null
            }
        }
        else if(type === "class"){
            newCriteria = {
                filterType: "fuzzy",
                label: "Class",
                field: "Class",
                query: null
            }
        }
        else if(type === "variant"){
            newCriteria = {
                filterType: "fuzzy",
                label: "Variant",
                field: "Variant",
                query: null
            }
        }

        let updatedValue = { ...criteriaStore.get() }
        updatedValue[type] = newCriteria
        criteriaStore.set(updatedValue)
    }

    const notHasCriteria = (criterion) => !(criterion in criteriaStore.get())

    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary">
                Add Search Criteria
            </Dropdown.Toggle>
            <Dropdown.Menu style={{"overflow": "auto", "max-height": "300px"}}>
                <For each={criteriaOptions}>{(criterion, i) =>
                    <Show when={[notHasCriteria, criterion]}>
                        <Dropdown.Item onClick={[addCriteria, criterion[0]]}>{criterion[1]}</Dropdown.Item>
                    </Show>
                }</For>
            </Dropdown.Menu>
        </Dropdown>
    )
}