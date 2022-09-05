import { Fragment, useEffect, } from 'react'; // Destructuring. Udstiller to navngivne elementer fra struktur.
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() { // Returnerer JSX
  const {activityStore}= useStore();

  useEffect(() => {                                  // React Hook (effect)
    activityStore.loadActivities()
  }, [activityStore]) // Array of dependencies. Tomt, så det sker præcist en gang efter load. Ellers ville effect-hook fyre igen efter nyt layout, og lave en loop
                      // nu lidt mindre tomt

  
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <Fragment> {/* En container. return returnerer 1 element. Fragment kan forkortes til <> */}
      <NavBar/>
      <Container style={{marginTop: '7em'}}> Margin top er 7em, ellers bliver de første aktiviteter gemt af navbar :-(
        <ActivityDashboard/>
      </Container>
    </Fragment>
  );
}

export default observer (App);
