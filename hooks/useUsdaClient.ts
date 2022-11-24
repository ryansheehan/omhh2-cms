import { useEffect, useMemo, useReducer, useState, createContext } from 'react';
import { useSanityClient } from './useSanityClient';

enum ClientState {
    uninitialized = 'uninitialized', 
    ready = 'ready', 
    fetching = 'fetching',
}

interface State {
    client: ClientState,
    apiKey: string,    
}

const initialState: State = {
    client: ClientState.uninitialized,
    apiKey: '',    
}

enum ActionType {
    Initialize = 'initialize',
    Fetch = 'fetch',
    FetchSuccess = 'fetch success',
    FetchError = 'fetch error',
}

interface Action {
    type: ActionType;
}

interface InitializeAction extends Action {
    type: ActionType.Initialize;
    apiKey: string;
}

interface FetchAction extends Action {
    type: ActionType.Fetch;
}

interface FetchSuccessAction extends Action {
    type: ActionType.FetchSuccess;
}

interface FetchErrorAction extends Action {
    type: ActionType.FetchError;
    message: string;
}

type Actions = InitializeAction
    | FetchAction | FetchSuccessAction | FetchErrorAction
;

function initializeAction (apiKey: string) { 
    const action: InitializeAction = { type: ActionType.Initialize, apiKey };
    return action;
};

function fetchAction () {
    const action: FetchAction = { type: ActionType.Fetch };
    return action;
}

function fetchSuccessAction () {
    const action: FetchSuccessAction = { type: ActionType.FetchSuccess };
    return action;
}

function fetchErrorAction (message: string) {
    const action: FetchErrorAction = { type: ActionType.FetchError, message };
    return action;
}

function reducer(state: typeof initialState, action: Actions) {
    switch(action.type) {
        case ActionType.Initialize:
            return {...state, client: ClientState.ready, apiKey: action.apiKey };            
        case ActionType.Fetch:
            return {...state, client: ClientState.fetching };
        case ActionType.FetchSuccess:
            return {...state, client: ClientState.ready };
        case ActionType.FetchError:
            console.error(action.message);
            return {...state, client: ClientState.ready };

    }
    throw new Error(`state "${(action as Action).type}" is unhandled`);  
}

interface USDANutrient {
    amount: number;
    nutrient: {
        name: string;
        unitName: string;
    }
}

interface USDAPortion {
    dataType: string;
    amount: number;
    gramWeight: number;
    measureUnit: {
        abbreviation: string;
        name: string;
    }
    modifier: string;
}

interface USDAFood {
    fdcId: number;
    description: string;
    foodNutrients: USDANutrient[];
    foodPortions: USDAPortion[];
    publicationDate: string;
}

export function useUsdaClient() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const sanity = useSanityClient();
    
    useEffect(() => {
        if(state.apiKey === '') {
            (async function () {
                const apiKey = await sanity.fetch('*[_type=="kvp" && key==$key][0].value', {key: 'usda'});
                dispatch(initializeAction(apiKey));
            })();            
        }
    }, []);
    
    const [isBusy, setIsBusy] = useState(true);

    useEffect(() => {
        setIsBusy(state.client !== ClientState.ready);
    }, [state]);

    async function fetchFdcId (fdcId: string): Promise<unknown> {
        dispatch(fetchAction());
        const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${state.apiKey}`;
        console.log('fetching: ', url);

        let food: unknown | null = null;

        try {
            const res = await fetch(url);
            const json: USDAFood = await res.json();

            food = json; // todo: transform response

            console.log(food);

            dispatch(fetchSuccessAction());
        } catch (error) {
            dispatch(fetchErrorAction(error?.toString() ?? 'unknown error'));            
        }
                
        return food;
    };

    return {fetchFdcId, isBusy};
}