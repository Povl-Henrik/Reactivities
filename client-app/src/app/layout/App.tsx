import { Fragment } from 'react'; // Destructuring. Udstiller to navngivne elementer fra struktur.
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/activities/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/activities/errors/NotFound';
import ServerError from '../../features/activities/errors/ServerError';

function App() { // Returnerer JSX

  const location= useLocation();

  return (
    <Fragment> {/* En container. return returnerer præcist 1 element. Fragment kan forkortes til <> */}
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={HomePage} /> {/* exact: ellers matcher den også '/activities' */}
      <Route
        path='/(.+)'
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}> Margin top er 7em, ellers bliver de første aktiviteter gemt under navbar :-(
              <Switch> {/* Så vises præcist en af nedenstående - den første, der matcher path. Outdated i React Route 6. Blev det default?  */}
                <Route exact path='/activities' component={ActivityDashboard} /> {/* http://localhost:3000/activities */}
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                {/* Pre 5.1 style <Route path='/errors' component={TestErrors} /> */}
                <Route path='/errors'><TestErrors/></Route>               
                <Route path='/server-error' component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
