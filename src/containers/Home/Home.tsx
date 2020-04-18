import { Link, RouteComponentProps } from '@reach/router';
import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Images } from '../../assets';
import { Button } from '../../components';
import { Routes } from '../../Routes';
import Styles from './Home.module.sass';

export const HomeScreen: React.FC<RouteComponentProps> = (props) => {
  // Props

  const { navigate } = props;

  // State Hooks

  const [isShowingModal = false, setShowingModal] = useState();
  const [player1Name, setPlayer1Name] = useState<string>();
  const [player2Name, setPlayer2Name] = useState<string>();

  // Validation

  const validateNames = () => {
    if (
      !player1Name ||
      !player2Name ||
      player1Name.trim().length === 0 ||
      player2Name.trim().length === 0
    ) {
      alert('Please enter both names');
      return;
    }
    navigate && navigate(Routes.Game, { state: { player1Name, player2Name } });
  };

  // Render methods

  return (
    <Container className="px-5 my-auto" fluid>
      <Modal
        dialogClassName={Styles.modalContainer}
        centered
        onHide={() => setShowingModal(false)}
        show={isShowingModal}>
        <Modal.Body>
          <Container>
            <Row>
              <Col
                className={[
                  'd-flex justify-content-center mb-4',
                  Styles.title,
                ].join(' ')}
                xs={12}>
                Start a New Game
              </Col>
              <Col
                className="d-flex align-items-center justify-content-center mb-1"
                xs={12}>
                <div className={Styles.playerData}>
                  <img src={Images.XIcon} alt="p1-icon" />
                  <span>Player 1</span>
                  <input
                    placeholder="Player 1"
                    onChange={(e) => setPlayer1Name(e.target.value.trim())}
                    className={Styles.playerName}></input>
                </div>
              </Col>
              <Col
                className="d-flex align-items-center justify-content-center mb-5"
                xs={12}>
                <div className={Styles.playerData}>
                  <img src={Images.OIcon} alt="p2-icon" />
                  <span>Player 1</span>
                  <input
                    placeholder="Player 2"
                    onChange={(e) => setPlayer2Name(e.target.value.trim())}
                    className={Styles.playerName}></input>
                </div>
              </Col>
              <Col className="d-flex justify-content-center mb-4" xs={12}>
                <Button onClick={validateNames} data-size="small">
                  Start!
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Row>
        <Col className="mx-auto" md={12} lg={8}>
          <img width="100%" src={Images.Logo} alt="Logo" />
        </Col>
      </Row>
      <Row>
        <Col
          className={['d-flex mt-5 mx-5', Styles.buttonsContainer].join(' ')}>
          <Button onClick={() => setShowingModal(true)}>New Game</Button>
          <Link to={Routes.Credits}>
            <Button>Credit</Button>
          </Link>
          <a href="https://google.com">
            <Button>
              Exit <img width="12px" src={Images.LogoutIcon} alt="" />
            </Button>
          </a>
        </Col>
      </Row>
    </Container>
  );
};
