
import { Component, Show, createEffect, createSignal, batch } from 'solid-js';
import { Container, Navbar, Nav, NavDropdown, Dropdown, Row, Col} from 'solid-bootstrap'
import {useForceStore} from './ForceStore';
import {useActiveForceStore} from './ActiveForceStore';


function NavBar(){

    const activeForce = useActiveForceStore()

    const forceName = () => activeForce.getForce() !== null && activeForce.getForce().name


    const handleNewList = () => { // TODO add a confirm if a force is loaded
        batch(() => {
            activeForce.setForce({} as Force)
            activeForce.setForceType("new")
        })
    }

    const handleExistingList = (force) => { // TODO Add a confirm if a force is loaded
        batch(() => {
            activeForce.setForce(force as Force)
            activeForce.setForceType("existing")
        })
    }

    return(
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand color="primary">AS 350 List Builder</Navbar.Brand>
            <Dropdown>
                <Dropdown.Toggle variant="success">{forceName() ? "List: " + forceName() : "Load list or Create New"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <For each={activeForce.listForces()}>{(force, i) =>
                            <Dropdown.Item onClick={[handleExistingList, force]}>
                                {force.name}
                            </Dropdown.Item>
                    }</For>
                    <Dropdown.Item onClick={handleNewList}>
                        -- New List --
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Navbar>
    )
}

export default NavBar;
