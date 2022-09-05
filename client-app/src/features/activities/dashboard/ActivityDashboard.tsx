
import { observer } from 'mobx-react-lite';
import { Grid, List } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';


export default observer(function ActivityDashboard() { // Destructuring Props.activities
    
    const {activityStore}= useStore();
    const {selectedActivity, editMode}= activityStore;

    return (
        <Grid>
            <Grid.Column width='10'> { /* Hvorfor er den ikke inde i en Grid.Row? */}
                <List>
                    <ActivityList/>
                </List>
            </Grid.Column>
            <Grid.Column width='6'>
                { selectedActivity && !editMode &&
                                   // Fortsætter kun, hvis activities[0] (Eller nu selectedActivity) ikke er null. 
                                   // Det er den ved første layout. Derefter hentes activities og der layes out igen
                                   // Nu er den så undefined indtil der selectes en Activity
                     <ActivityDetails/>
                }
                { editMode &&
                      <ActivityForm
                      />
                }
            </Grid.Column>
        </Grid>
    )
})