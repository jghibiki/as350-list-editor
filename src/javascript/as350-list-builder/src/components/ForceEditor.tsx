import { Component, Switch, Match, createEffect, createSignal, For} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button } from 'solid-bootstrap'
import {useActiveForceStore} from './ActiveForceStore';
import Force from '../entities/Force'
import NewFactionDetails from './NewFactionDetails';
import ExistingForceEditor from './ExistingForceEditor';
import {ActiveForceStoreProvider} from './ActiveForceStore';
import {CriteriaStoreProvider} from './CriteriaStore'

function ListEditor(){
    const activeForceStore = useActiveForceStore()

    const showNewEditor = () => activeForceStore.getForceType() === "new"
    const showExistingEditor = () => activeForceStore.getForceType() === "existing"

    createEffect(()=>{
        console.log("force type: " + activeForceStore.getForceType())
    })

    return (
        <Container style={{"margin-top": "20px"}}>
            <Show
                when={activeForceStore.getForce() !== undefined && activeForceStore.getForce() !== null}
                fallback={<p>Load a force or create a new one to continue.</p>}
            >
                <Switch>
                    <Match when={showNewEditor()}>
                        <NewFactionDetails/>
                    </Match>
                    <Match when={showExistingEditor()}>
                        <CriteriaStoreProvider>
                            <ExistingForceEditor/>
                        </CriteriaStoreProvider>
                    </Match>
                </Switch>
            </Show>
        </Container>
    )
}

export default ListEditor;