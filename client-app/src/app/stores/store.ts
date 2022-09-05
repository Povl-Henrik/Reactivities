import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore;
}

export const store: Store= {
    activityStore: new ActivityStore()
}

export const StoreContext= createContext(store); // En React Context - hvad det så måtte være

export function useStore() {
    return useContext(StoreContext);
}