import axios, { Axios, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

const sleep= (delay: number) => {
    return new Promise((resolve, fail) => {
        setTimeout(resolve, delay);
    });
}

axios.defaults.baseURL= 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response; // Der så syltes ind i et resolved Promise
    } catch (error) {
        console.log(error);
        return await Promise.reject<never>(error);
    }
})

const responseBody= <T>(response: AxiosResponse<T>) => response.data;
// response indeholder også status, mv: https://axios-http.com/docs/res_schema Det er derfor, hint over response.data siger: AxiosResponse<T, any>

const requests= { // cave: Node.js har en global function: request, så stav omhyggeligt :-(
    get: <T> (url: string) => axios.get<T>(url).then(responseBody), // get tager også en anden parameter: options
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody), // {}?? Hvorfor ikke Activity?
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities= {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`), // Bemærk ` i stedet for ', så kan man lave den der $-substitution
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => { console.log(activity.venue); return axios.put(`/activities/${activity.id}`, activity)},
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent= {
    Activities
}

export default agent;