import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity } from '../models/activity';
import { store } from '../stores/store';

const sleep= (delay: number) => {
    return new Promise((resolve, fail) => {
        setTimeout(resolve, delay);
    });
}

axios.defaults.baseURL= 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response; // Der så syltes ind i et resolved Promise
}, (error: AxiosError<any>) => { // <any> ?? I den seneste version af Axios er default ændret til unknown
    const {data, status, config}= error.response!;
    console.log(error.response);
    switch(status) {
        case 400:
            if (config.method === 'get' && data.errors && data.errors.hasOwnProperty('id')) { // data.errors && ?? ellers dør metoden, hvis data er en string :-(
                history.push('/not-found'); // Hvilket jo altså kortslutter nedenstående
            }
            if (data.errors) {
                const modalStateErrors= [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401: toast.error('unauthorized'); break;
        case 404: history.push('not-found'); break;
        case 500: store.commonStore.setServerError(data);
                  history.push('/server-error');
                  break;
    }
    return Promise.reject(error);
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
    update: (activity: Activity) => { console.log(activity.venue); return requests.put(`/activities/${activity.id}`, activity)},
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent= {
    Activities
}

export default agent;