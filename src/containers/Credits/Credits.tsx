import { Link, RouteComponentProps } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Images } from '../../assets';
import { Button } from '../../components';
import { Routes } from '../../Routes';
import Styles from './Credits.module.sass';

/**
 * Sends a network request to fetch credits from API.
 */
const useCredits = () => {
  const [credits, setCredits] = useState<string[]>();

  useEffect(() => {
    fetch('http://api.tvmaze.com/people/1/castcredits')
      .then((res) => res.json())
      .then((json) => {
        return Promise.all(
          json.map((val: any) =>
            fetch(val._links.character.href).then((res) => res.json())
          )
        );
      })
      .then((data) => {
        setCredits(data.map((val: any) => val.name));
      });
  }, []);

  return credits;
};

export const CreditsScreen: React.FC<RouteComponentProps> = () => {
  // Custom Hooks

  const credits = useCredits();

  // Render methods

  return (
    <Container className="px-5 my-auto" fluid>
      <Row>
        <Col className="mx-auto" md={12} lg={8}>
          <img width="100%" src={Images.Logo} alt="Logo" />
        </Col>
      </Row>
      <Row>
        <Col>
          <h3 className={Styles.heading}>Credit</h3>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <div className={Styles.credits}>
            {!credits
              ? 'Loading Credits...'
              : credits.map((credit) => {
                  return <div key={credit}>{credit}</div>;
                })}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center mt-4">
          <Link to={Routes.Home}>
            <Button className={Styles.backButton}>Back</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};
