import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    activityRegistry= new Map<string, Activity>();
    selectedActivity: Activity | undefined= undefined;
    editMode= false;
    loading= false;
    loadingInitial= true;

    constructor() {
        /* den pæne måde
           makeObservable(this, {
              title: observable,
              setTitle: action // fordi setTitle er erklæret i Lambda-notation, er den automatisk bound?? Ellers skulle der stå: setTitle: action.bound
                               // bound? Så må man bruge this til at tilgå state
          });
        Den nemme måde */
        makeAutoObservable(this);
    }

    get activitiesByDate() { // Computed attribute
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
                      Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities= async () => { // Man må ikke ændre state i en async metode uden at kalde en action, der gør det eller wrappe i runInAction
        //this.setLoadingInitial(true);
        try {
            const activities= await agent.Activities.list();
            activities.forEach(activity => { 
              activity.date= activity.date.split('T')[0];
              //this.activities.push(activity);
              this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial= (state: boolean) => {
        this.loadingInitial= state;
    }

    selectActivity= (id: string) => {
        // this.selectedActivity= this.activities.find(a => a.id = id);
        this.selectedActivity= this.activityRegistry.get(id);
    }

    cancelSelectedActivity= () => {
        this.selectedActivity= undefined;
    }

    openForm= (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode= true;
    }

    closeForm= () => {
        this.editMode= false;
    }


    createActivity= async (activity: Activity) => {
        this.loading= true;
        activity.id= uuid();

        try {
           await agent.Activities.create(activity);
           runInAction(() => {
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity= activity;
            this.editMode= false;
            this.loading= false;
           })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.editMode= false; // Den har han ikke med???
                this.loading= false;
            })
        }
    }


    updateActivity= async (activity: Activity) => {
        this.loading= true;

        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                //this.activities.filter(a => a.id !== activity.id); // Vil det virke?
                //this.activities.push(activity); // Så redigerede aktiviteter ender sidst.
                //this.activities= [...this.activities.filter(a => a.id !== activity.id), activity]; // OK, men stadig sidst.
                this.activityRegistry.set(activity.id, activity); // OK, det vil virke
                this.selectedActivity= activity;
                this.editMode= false;
                this.loading= false;
            })
        } catch (error) {
            console.log(error);
            this.editMode= false; // Den har han stadig ikke med??
            this.loading= false;
       }
    }


    deleteActivity= async (id: string) => {
        this.loading= true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                //this.activities= [...this.activities.filter(a => a.id !== id)];
                this.activityRegistry.delete(id);
                if (this.selectedActivity?.id === id) { // this.selectedActivity? !== this.selectedActivity! Hvis selectedActivity er undefined stopper evalueringen
                    this.cancelSelectedActivity();
                }
                this.loading= false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading= false;
            })
        }
    }
}