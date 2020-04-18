import { Link, RouteComponentProps } from '@reach/router';
import { intersection } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { Images } from '../../assets';
import { Button } from '../../components';
import { Routes } from '../../Routes';
import Styles from './Game.module.sass';

const board = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

enum Player {
  Player1 = 'p1',
  Player2 = 'p2',
}

interface Move {
  player: Player;
  tile: number;
}

const isRowWinner = (playerMoves: number[]) => {
  if (playerMoves.length < 3) {
    return;
  }
  const winnerRows = board
    .map((row) => intersection(playerMoves, row))
    .filter((row) => row.length === 3);
  if (winnerRows.length === 0) {
    return;
  }
  return winnerRows[0];
};

const isColumnWinner = (playerMoves: number[]) => {
  if (playerMoves.length < 3) {
    return;
  }
  let row = 0,
    column = 0;
  for (column; column < 3; column++) {
    const markedTiles: number[] = [];
    for (row; row < 3; row++) {
      if (playerMoves.includes(board[row][column])) {
        markedTiles.push(board[row][column]);
      }
    }
    if (markedTiles.length === 3) {
      return markedTiles;
    }
  }
  return;
};

const isDiagonalWinner = (playerMoves: number[]) => {
  if (intersection(playerMoves, [1, 5, 9]).length === 3) {
    return [1, 5, 9];
  }
  if (intersection(playerMoves, [3, 5, 7]).length === 3) {
    return [3, 5, 7];
  }
  return;
};

interface GameResult {
  winner: Player;
  winningStreak: 'row' | 'column' | 'diagonal-right' | 'diagonal-left';
  winningMoves: number[];
}

const useWinnerEvaluation = (player: Player, moves: Move[]) => {
  const [result, setResult] = useState<GameResult>();

  // Life cycle methods

  useEffect(() => {
    const playerMoves = moves
      .filter((move) => move.player === player)
      .map((move) => move.tile);

    const rowMoves = isRowWinner(playerMoves);
    if (rowMoves) {
      setResult({
        winner: Player.Player1,
        winningMoves: rowMoves,
        winningStreak: 'row',
      });
      return;
    }

    const columnMoves = isColumnWinner(playerMoves);
    if (columnMoves) {
      setResult({
        winner: Player.Player1,
        winningMoves: columnMoves,
        winningStreak: 'column',
      });
      return;
    }

    const diagonalMoves = isDiagonalWinner(playerMoves);
    if (diagonalMoves) {
      setResult({
        winner: Player.Player1,
        winningMoves: diagonalMoves,
        winningStreak: diagonalMoves.includes(9)
          ? 'diagonal-left'
          : 'diagonal-right',
      });
      return;
    }

    setResult(undefined);
  }, [moves, player]);

  return result;
};

export const GameScreen: React.FC<RouteComponentProps> = (props) => {
  // Props

  const { p1Name = 'Player 1', p2Name = 'Player 2' } = props.location!
    .state as any;

  const players = {
    p1: {
      name: p1Name,
      icon: Images.XIcon,
    },
    p2: {
      name: p2Name,
      icon: Images.OIcon,
    },
  };

  // State Hooks

  const [currentPlayer = Player.Player1, setCurrentPlayer] = useState<Player>();
  const [moves = [], setMoves] = useState<Move[]>();

  const p1Evaluation = useWinnerEvaluation(Player.Player1, moves);
  const p2Evaluation = useWinnerEvaluation(Player.Player2, moves);
  const gameResult = p1Evaluation || p2Evaluation;

  // Render methods

  const renderTile = (tileNumber: number) => {
    const markedMove = moves.filter((move) => move.tile === tileNumber);

    const updateGameProgress = () => {
      if (moves.map((move) => move.tile).includes(tileNumber)) {
        return;
      }
      setMoves([...moves, { tile: tileNumber, player: currentPlayer }]);
      setCurrentPlayer(
        currentPlayer === Player.Player1 ? Player.Player2 : Player.Player1
      );
    };

    return (
      <div
        onClick={updateGameProgress}
        key={tileNumber.toString()}
        className={Styles.tile}>
        <img
          width="100%"
          data-marked={markedMove.length !== 0 ? 'true' : 'false'}
          src={
            (markedMove.length !== 0 && players[markedMove[0].player].icon) ||
            players[currentPlayer].icon
          }
          alt="pad"
        />
        {gameResult && gameResult.winningMoves.includes(tileNumber) && (
          <div className={Styles.winOverlay}>
            <div
              data-strike-style={gameResult.winningStreak}
              className={Styles.strike}></div>
          </div>
        )}
      </div>
    );
  };

  const renderGameBoard = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderTile);
  };

  const renderModalBody = () => {
    if (!gameResult) {
      return;
    }
    return (
      <Modal.Body>
        <Container>
          <Row>
            <Col
              className={[
                'd-flex justify-content-center mb-4',
                Styles.title,
              ].join(' ')}
              xs={12}>
              Victory to Player {players[gameResult.winner].name}!
            </Col>
            <Col className="d-flex justify-content-center mb-4" xs={12}>
              <img
                width="64px"
                alt="winner"
                src={players[gameResult.winner].icon}
              />
              <img width="64px" src={Images.VictoryIcon} alt="victory" />
            </Col>
            <Col className="d-flex" xs={12}>
              <Button
                onClick={() => {
                  setMoves([]);
                  setCurrentPlayer(Player.Player1);
                }}
                data-size="small">
                Restart
              </Button>
              <Link to={Routes.Home}>
                <Button data-size="small">Quit</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    );
  };
  return (
    <Container className="px-5 my-auto" fluid>
      <Modal centered dialogClassName={Styles.winnerModal} show={!!gameResult}>
        {renderModalBody()}
      </Modal>
      <Row>
        <Col>
          <img src={Images.Logo} alt="Logo" width="100%" />
        </Col>
        <Col className="ml-4">
          <Row className={Styles.playerData}>
            <img src={Images.XIcon} alt="p1-icon" />
            <span>Player 1</span>
            <span
              data-active={currentPlayer === Player.Player1 ? 'true' : 'false'}
              className={Styles.playerName}>
              {p1Name}
            </span>
          </Row>
          <Row className={Styles.playerData}>
            <img src={Images.OIcon} alt="p2-icon" />
            <span>Player 1</span>
            <span
              data-active={currentPlayer === Player.Player2 ? 'true' : 'false'}
              className={Styles.playerName}>
              {p2Name}
            </span>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className={Styles.gameBoard}>{renderGameBoard()}</div>
        </Col>
      </Row>
    </Container>
  );
};
