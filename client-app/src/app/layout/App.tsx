import { Fragment, useEffect, useState } from 'react'; // Destructuring. Udstiller to navngivne elementer fra struktur.
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() { // Returnerer JSX

  const [activities, setActivities] = useState<Activity[]>([]);  // React Hook (state) - initialiseret med tomt array af Activities
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode]= useState<boolean>(false); // den ville kunne udlede boolean af værdien false.

  useEffect(() => {                                  // React Hook (effect)
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => { // get tager også en anden parameter: options
      // response indeholder også status, mv: https://axios-http.com/docs/res_schema
      setActivities(response.data);
    })
  }, []) // Array of dependencies. Tomt, så det sker præcist en gang efter load. Ellers ville effect-hook fyre igen, og lave en loop

  function handleSelectActivity(id: String) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    activity.id 
      ? setActivities([...activities.filter(x=> x.id !== activity.id), activity]) // ... Spread syntax
      : setActivities([...activities, {...activity, id: uuid() }]);
    setEditMode(false);
    setSelectedActivity(activity); // Han glemmer så id for nye Activities
  }


  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <Fragment>
      <NavBar openForm= {handleFormOpen}/>
      <Container style={{marginTop: '7em'}}> Margin top er 7em, ellers bliver de første aktiviteter gemt af navbar :-(
        <ActivityDashboard 
          activities= {activities}
          selectedActivity= {selectedActivity}
          selectActivity= {handleSelectActivity}
          cancelSelectActivity= {handleCancelSelectActivity}
          editMode= {editMode}
          openForm= {handleFormOpen}
          closeForm= {handleFormClose}
          createOrEdit= {handleCreateOrEditActivity}
          deleteActivity= {handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
