import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header, List, ListList } from 'semantic-ui-react';

function App() { // Returnerer JSX

  const [activities, setActivities] = useState([]);  // React Hook (state)

  useEffect(() => {                                  // React Hook (effect)
    axios.get('http://localhost:5000/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
    })
  }, []) // Array of dependencies. Tomt, så det sker præcist en gang efter load. Ellers ville state-hook fyre, og lave en loop

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities' />
 
        
        <List>
          {activities.map((activity: any) => ( // any? uden ordentlig type på activity, ved ingen, at der er en id i den
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))}
        </List>

    </div>
  );
}

export default App;
