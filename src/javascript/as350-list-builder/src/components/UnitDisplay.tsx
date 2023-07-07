import { Component, Switch, Match, createEffect, createSignal, For, children, mergeProps } from 'solid-js';
import { Container, Dropdown, Row, Col, Form, FloatingLabel, Button, Stack, Tab, Tabs, Card, Pagination } from 'solid-bootstrap'




export function UnitDisplay(props){
    const merged = mergeProps(
        {
            pointsField: "BFPointValue"
        },
        props
    )
    const unit = () => props.unit
    const header = children(() => props.header || null)
    const c = children(() => props.children || null)
    const unitCard = () => {
        return "https://masterunitlist.azurewebsites.net/Unit/Card/" + unit().Id + "?skill=4"
    }

    const unitAbilities = () => {
        let abilities = unit().BFAbilities
        if(abilities !== null && abilities !== undefined){
            return abilities.replaceAll(",", ", ")
        }
        else {
            return ""
        }
    }

    const validUnitVariant = () => {
        return !(
            unit().Variant === "" ||
            unit().Variant === " " ||
            unit().Variant === null
        )
    }

    const tmm = () => {
        let move = parseInt(
            unit()
            .BFMove
            .replaceAll("\"", "")
            .split("/")[0]
        )
        if(move < 6){
            return 0
        }
        else if(move >= 6 && move <= 8){
            return 1
        }
        else if(move >= 10 && move <= 12){
            return 2
        }
        else if(move >= 14 && move <= 18){
            return 3
        }
        else if(move >= 14 && move <= 18){
            return 3
        }
        else if(move >= 19 && move <= 34){
            return 4
        }
        else {
            return 5
        }
    }

    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col>
                        {unit().Class}
                        <Show when={validUnitVariant()}>
                                &nbsp;- {unit().Variant}
                        </Show>
                    </Col>
                    <Show when={props.header !== undefined && props.header !== null}>
                        <Col>
                            {header()}
                        </Col>
                    </Show>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col style={{"max-width": "120px"}}>
                        <Row>
                            <Col>
                                <Card.Img variant="top" src={unit().ImageUrl} style={{ width: '4rem'}} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Row>
                                    <Col className="text-center">
                                        <strong>Type</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        {unit().Type === undefined ? "" : unit().Type.Name}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                 <strong>Overheat:</strong> {unit().BFOverheat}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={9}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col className="text-center">
                                        <strong>Role</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        {unit().Role.Name}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col className="text-center">
                                        <strong>Tonnage</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        {unit().Tonnage}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col className="text-center">
                                        <strong>Move</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        {unit().BFMove}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col className="text-center">
                                        <strong>TMM</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        {tmm()}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col className="text-center">
                                        <strong>PV</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        {unit()[merged.pointsField]}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr style={{"border-top": "2px solid black", "margin-top": "4px", "margin-bottom": "4px"}}/>
                        <Row >
                            <Col>
                                <Card.Text><strong>Armor:</strong> {unit().BFArmor}</Card.Text>
                            </Col>
                            <Col>
                                <Card.Text><strong>Structure:</strong> {unit().BFStructure}</Card.Text>
                            </Col>
                        </Row>
                        <hr style={{"border-top": "2px solid black", "margin-top": "4px", "margin-bottom": "4px"}}/>
                        <Row>
                            <Col>
                                <strong>Damage</strong>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <strong>S</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {unit().BFDamageShort}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <strong>M</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {unit().BFDamageMedium}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <strong>L</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {unit().BFDamageLong}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <strong>E</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {unit().BFDamageExtreme}
                                    </Col>
                                </Row>
                            </Col>
                            <Col/>
                        </Row>
                        <hr style={{"border-top": "2px solid black", "margin-top": "4px", "margin-bottom": "4px"}}/>
                        <Row>
                            <Col>
                                <strong>Abilities:</strong> {unitAbilities()}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
            <Show when={props.children !== undefined && props.children !== null}>
                <Card.Footer>
                    <Row>
                        <Col>
                            {c()}
                        </Col>
                    </Row>
                </Card.Footer>
            </Show>
        </Card>
    )
}