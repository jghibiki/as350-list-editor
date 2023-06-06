import { Component, Switch, Match, createEffect, createSignal, For} from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button, Stack, Tab, Tabs, Card, Pagination } from 'solid-bootstrap'
import {UnitDisplay} from './UnitDisplay'
import {useActiveForceStore} from './ActiveForceStore'


export function SearchResultDisplay(props){
    const searchResults = () => props.searchResults() || null
    const [numResults, setNumResults] = createSignal(0)
    const [numberOfPages, setNumberOfPages] = createSignal(0)
    const [page, setPage] = createSignal(1)
    const [pageResults, setPageResults] = createSignal([])
    const pageSize = 10
    const activeForceStore = useActiveForceStore()

    createEffect(() => {
        let num = (searchResults() === null) ? 0 : searchResults().length
        setNumResults(
            num
        )

        setNumberOfPages(
            Math.ceil(num / pageSize)
        )

        setPageResults(
            getPage(0, pageSize)
        )

    })

    const getPage = (idx, page) => {
        if(searchResults() === null) return []
        let off = idx * pageSize
        return searchResults().slice(off, off+pageSize)
    }

    createEffect(() => {
        let offsetPage = page() -1
        setPageResults(
            getPage(offsetPage, pageSize)
        )
    })

    const firstPage = () => page() === 1
    const lastPage = () => page() === numberOfPages()
    const hasPreviousPage = () => page() > 1
    const hasNextPage = () => page() < numberOfPages()

    const incPage = () => {
        let p = Math.min(
            numberOfPages(),
            page() + 1
        )
        setPage(p)
    }

    const decPage = () => {
        let p = Math.min(
            1,
            page() - 1
        )
        setPage(p)
    }

    const handleAddToForce = (unit) => {
        let activeForce = { ...activeForceStore.getForce()}
        let newUnit = {
            ...unit,
            "pilotSkill": "4"
        }
        activeForce.roster.push(newUnit)
        activeForceStore.setForce(activeForce)
        activeForceStore.setHasUnsavedEdits(true)
    }

    return (
        <>
            <Switch>
                <Match when={pageResults().length > 0}>
                    <div style={{"width": "100%"}}>
                        <For each={pageResults()}>{(unit, i) =>
                            <Row style={{"margin-top": "20px"}}>
                                <Col>
                                    <UnitDisplay unit={unit}>
                                        <Button style={{"float":"right"}} onClick={[handleAddToForce, unit]}>
                                            Add to List
                                        </Button>
                                    </UnitDisplay>
                                </Col>
                            </Row>
                        }</For>
                    </div>
                    <Row>
                        <Col>
                            <Show when={!firstPage()}>
                                <Button style={{"margin-right": "5px"}} onClick={[setPage, 1]}>
                                    «
                                </Button>
                            </Show>
                            <Show when={hasPreviousPage()}>
                                <Button onClick={() => setPage(Math.max(1, page()-1))}>
                                    &lt;
                                </Button>
                            </Show>
                        </Col>
                        <Col>
                            Page {page()} of {numberOfPages()}
                        </Col>
                        <Col>
                            <Show when={hasNextPage()}>
                                <Button style={{"margin-right": "5px"}} onClick={incPage}>
                                    &gt;
                                </Button>
                            </Show>
                            <Show when={!lastPage()}>
                                <Button onClick={[setPage, numberOfPages]}>
                                    »
                                </Button>
                            </Show>
                        </Col>
                    </Row>
                </Match>
                <Match when={pageResults().length === 0}>
                    <p className="text-center" style={{"margin-top": "30px"}}>
                    No units match the provided search criteria.
                    </p>
                </Match>
            </Switch>
        </>
    )
}