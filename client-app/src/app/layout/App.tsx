import { Fragment } from 'react'; // Destructuring. Udstiller to navngivne elementer fra struktur.
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() { // Returnerer JSX

  const location= useLocation();

  return (
    <Fragment> {/* En container. return returnerer 1 element. Fragment kan forkortes til <> */}
      <Route exact path='/' component={HomePage} /> {/* exact: ellers matcher den også '/activities' */}
      <Route 
          path='/(.+)'
          render= {() => (
          <>
            <NavBar/>
            <Container style={{marginTop: '7em'}}> Margin top er 7em, ellers bliver de første aktiviteter gemt af navbar :-(
              <Route exact path='/activities' component={ActivityDashboard} /> {/* http://localhost:3000/activities */}
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route key= {location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
            </Container>
          </>
          )}
      />
    </Fragment>
  );
}

export default observer (App);
