import { Component, Switch, Match, createEffect, createSignal, For} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button, Stack, Tab, Tabs, Card } from 'solid-bootstrap'
import {useForceStore} from './ForceStore';
import {useActiveForceStore} from './ActiveForceStore';
import Force from '../entities/Force'
import {factions, searchUnits} from '../helpers/ManifestHelpers'
import manifest from '../data/manifest.json'
import {CriteriaEditor, AddCriteriaButton, criteriaOptions, allCriteriaValid} from './CriteriaEditor'
import {useCriteriaStore} from './CriteriaStore'
import {SearchResultDisplay} from './SearchResultDisplay'
import {RosterDisplay} from './RosterDisplay'


function ExistingForceEditor(){

    const [searchResults, setSearchResults] = createSignal(null)
    const [tab, setTab] = createSignal("criteria")
    const activeForceStore = useActiveForceStore()
    const criteriaStore = useCriteriaStore()

    const disableSubmit = () => {
        let force = activeForceStore.getForce()
        return !(
            activeForceStore.getForce() !== null &&
            activeForceStore.getForce() !== undefined  &&
            activeForceStore.listValid() &&
            activeForceStore.hasUnsavedEdits()
        )
    }

    const handleSaveForce = () =>{
        // todo: add additional fields
        activeForceStore.setForce({
            ...activeForceStore.getForce(),
        })

        activeForceStore.saveActiveForce()
        activeForceStore.setForceType("existing")
    }


    const handleSearch = () => {
        setTab("results")
        let units = searchUnits(
            activeForceStore.getForce().faction,
            activeForceStore.getForce().availabilityEra,
            Object.values(criteriaStore.get())
        )
        setSearchResults(units)
    }

    const handleDeleteForce = () => {
        let shouldDelete = confirm("Are you sure you wish to delete this force?")

        if(shouldDelete){
            activeForceStore.deleteActiveForce()
        }
    }

    return (
        <div>
            <Row>
                <Col></Col>
            </Row>
            <Row style={{"margin-top": "20px"}}>
                <Col style={{ "border": "solid 1px", "padding-top": "15px"}} xs={10}>
                    <Row >
                        <Col>
                            <p><strong>Force Name:</strong> {activeForceStore.getForce().name}</p>
                        </Col>
                        <Col>
                            <p><strong>Faction:</strong> {activeForceStore.getForce().faction}</p>
                        </Col>
                        <Col>
                            <p><strong>Availability Era:</strong> {activeForceStore.getForce().availabilityEra}</p>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2} style={{"padding-top": "12px"}}>
                    <Stack gap={2}>
                        <Button
                            class="mx-auto"
                            variant={disableSubmit() ? "outline-secondary": "primary"}
                            disabled={disableSubmit()}
                            onClick={handleSaveForce}
                        >
                            Save Force
                        </Button>
                        <Button
                            class="mx-auto"
                            style={{"margin-top": "5px"}}
                            onClick={handleDeleteForce}
                        >
                            Delete Force
                        </Button>
                    </Stack>
                </Col>
            </Row>
            <Row style={{"margin-top": "15px"}} >
                <Col style={{ "border": "solid 1px", "padding-top": "15px"}} sm="6">
                    <Row>
                        <Col>
                            <h3>Roster</h3>
                        </Col>
                    </Row>
                    <Row style={{"text-align": "left"}}>
                        <Col>
                            <RosterDisplay/>
                        </Col>
                    </Row>

                </Col>
                <Col sm="6">
                    <div style={{ "border": "solid 1px", "padding-top": "15px", "margin-left": "5px", "padding-bottom": "15px",}}>
                        <Row>
                            <Col>
                                <h3>Unit Search</h3>
                            </Col>
                        </Row>
                        <Tabs activeKey={tab()} onSelect={(t) => setTab(t)} className="mb-3">
                            <Tab eventKey="criteria" title="Search Criteria">
                                <Row style={{"margin-top": "20px"}}>
                                    <Col style={{"text-align": "right", "margin-right": "10px"}}>
                                        <AddCriteriaButton/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form style={{"padding": "15px", "text-align": "left"}} onSubmit={(e)=>{e.preventDefault()}}>
                                            <For each={Object.keys(criteriaStore.get())}>{(criterion, i) =>
                                                <CriteriaEditor criterion={criterion}/>
                                            }</For>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{"text-align": "right", "margin-right": "10px"}}>
                                        <Show when={Object.keys(criteriaStore.get()).length > 0}>
                                            <Button
                                                onClick={handleSearch}
                                                disabled={!allCriteriaValid(Object.values(criteriaStore.get()))}
                                            >
                                                Search
                                            </Button>
                                        </Show>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab
                                eventKey="results"
                                title="Search Results"
                                style={{"text-align": "left"}}
                                disabled={searchResults() === null}
                            >
                                <Container>
                                    <SearchResultDisplay searchResults={searchResults} />
                                </Container>
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ExistingForceEditor