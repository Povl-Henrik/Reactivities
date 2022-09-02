import { Fragment, useEffect, useState } from 'react'; // Destructuring. Udstiller to navngivne elementer fra struktur.
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() { // Returnerer JSX

  const [activities, setActivities] = useState<Activity[]>([]);  // React Hook (state) - initialiseret med tomt array af Activities
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode]= useState<boolean>(false); // den ville kunne udlede boolean af værdien false.
  const [Loading, setLoading]= useState(true);
  const [submitting, setSubmitting]= useState(false);

  useEffect(() => {                                  // React Hook (effect)
    agent.Activities.list().then(response => {
      let activities: Activity[]= [];
      response.forEach(activity => { // ie, han regner med at det er en value-parameter, selvom en struct ikke plejer at være det i JavaScript. Er den det i Typescript?
        activity.date= activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
    })
  }, []) // Array of dependencies. Tomt, så det sker præcist en gang efter load. Ellers ville effect-hook fyre igen efter nyt layout, og lave en loop

  function handleSelectActivity(id: String) { // ie: man kan have lokale funktioner i en funktion
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(x=> x.id !== activity.id), activity]) // ... Spread syntax
      setSelectedActivity(activity); // Ikke ned efter if, skal vente på overførel. Hvorfor venter han ikke i agent.Activities ???
      setEditMode(false);
      setSubmitting(false);
      })
    } else {
      activity.id= uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity); 
        setEditMode(false);
        setSubmitting(false);
        })
    } 
  }


  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
    
  }

  if (Loading) return <LoadingComponent content='Loading app'/>

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
          submitting= {submitting}
        />
      </Container>
    </Fragment>
  );
}

export default App;
