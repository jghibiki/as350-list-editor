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
    const c = children(() => props.children || null)

    return (
        <Card>
            <Card.Header>
                {unit().Class} - {unit().Variant}
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Img variant="top" src={unit().ImageUrl} style={{ width: '4rem'}} />
                    </Col>
                    <Col xs={9}>
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
                    <hr style={{"border-top": "2px solid black"}}/>
                    <Row>
                        <Col/>
                        <Col>
                            <Card.Text><strong>Armor:</strong> {unit().BFArmor}</Card.Text>
                        </Col>
                        <Col>
                            <Card.Text><strong>Structure:</strong> {unit().BFStructure}</Card.Text>
                        </Col>
                        <Col/>
                    </Row>
                    <hr style={{"border-top": "2px solid black"}}/>
                    <Row className="text-center" style={{"margin-bottom": "15px"}}>
                        <Col>
                            <strong>Damage</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col/>
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
                    <Row style={{"margin-top": "20px"}}>
                        <Col>
                             <strong>Overheat:</strong> {unit().BFOverheat}
                        </Col>
                        <Col>
                            <strong>Abilities:</strong> {unit().BFAbilities}
                        </Col>
                    </Row>
                </Col>
                </Row>
                    <Show when={props.children !== undefined && props.children !== null}>
                        <hr style={{"border-top": "2px solid black"}}/>
                        {c()}
                    </Show>
            </Card.Body>
        </Card>
    )
}