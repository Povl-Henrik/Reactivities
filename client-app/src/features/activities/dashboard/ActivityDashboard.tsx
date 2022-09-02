import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

export default function ActivityDashboard({activities, selectedActivity, 
                                           selectActivity, cancelSelectActivity,
                                           editMode, openForm, closeForm, 
                                           createOrEdit, deleteActivity}: Props) { // Destructuring Props.activities
    return (
        <Grid>
            <Grid.Column width='10'> { /* Hvorfor er den ikke inde i en Grid.Row? */}
                <List>
                    <ActivityList activities= {activities} 
                                  selectActivity= {selectActivity}
                                  deleteActivity= {deleteActivity}/>
                </List>
            </Grid.Column>
            <Grid.Column width='6'>
                { selectedActivity && !editMode &&
                                   // Fortsætter kun, hvis activities[0] (Eller nu selectedActivity) ikke er null. 
                                   // Det er den ved første layout. Derefter hentes activities og der layes out igen
                                   // Nu er den så undefined indtil der selectes en Activity
                     <ActivityDetails activity={selectedActivity}
                                      cancelSelectActivity= {cancelSelectActivity}
                                      openForm= {openForm}

                     />
                }
                { editMode &&
                      <ActivityForm closeForm= {closeForm} 
                                    activity= {selectedActivity}
                                    createOrEdit= {createOrEdit}
                      />
                }
            </Grid.Column>
        </Grid>
    )
}