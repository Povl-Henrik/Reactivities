
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, List } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';


export default observer(function ActivityDashboard() { // Destructuring Props.activities
    
    const {activityStore}= useStore();
    const {loadActivities, activityRegistry}= activityStore; // Så hellere lade loadActivities lave det chesk :-(

    useEffect(() => {                                  // React Hook (effect)
      if (activityRegistry.size <= 1) { // Ikke ""=== 0)" for man kunne komme her efter at have viewet en enkeltaktivitet - og der er jo mere end 1 aktivitet :-(
        loadActivities();               // hvad med en hasLoaded egenskab i activityStore? Der så kunne få ansvaret :-(
      }
    }, [activityRegistry.size, loadActivities]) // Array of dependencies. Tomt, så det sker præcist en gang efter load. Ellers ville effect-hook fyre igen efter nyt layout, og lave en loop
                        // nu lidt mindre tomt
  
    
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>
  
  

    return (
        <Grid>
            <Grid.Column width='10'> { /* Hvorfor er den ikke inde i en Grid.Row? */}
                <List>
                    <ActivityList/>
                </List>
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters/>
            </Grid.Column>
        </Grid>
    )
})