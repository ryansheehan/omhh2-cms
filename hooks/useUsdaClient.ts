import { useEffect, useReducer, useState } from 'react';
import { useSanityClient } from './useSanityClient';
import type {Food, Nutrient, Portion, FoodSource} from '../schemas/food';

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
}

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
    dataType: string;
    description: string;
    foodNutrients: USDANutrient[];
    foodPortions: USDAPortion[];
    publicationDate: string;
}

function mapFoodSource(dataType: string): FoodSource {
    switch(dataType.toLowerCase()) {
        case 'foundation': return 'foundation_food';
        case 'survey (fndds)': return 'survey_fndds_food';
        case 'sr legacy': return 'sr_legacy_food';
        case 'branded': return 'branded_food';
        case 'experimental': return 'experimental_food';
        case 'sample': return 'sample_food';
        case 'sub sample': return 'sub_sample_food';
        case 'agricultural acquisition': return 'agricultural_acquisition';
        case 'market acquisition': return 'market_acquisition';
    }
    return 'custom';
}

function mapFood({fdcId, description, foodNutrients, foodPortions, publicationDate, dataType}: USDAFood) {
    const food: Food = {
        fdcid: fdcId.toString(),
        description,
        usdaPublicationDate: publicationDate,
        source: mapFoodSource(dataType),
        portions: foodPortions.map(({amount, gramWeight, measureUnit, modifier}) => {
            const portion: Portion = {
                amount, gramWeight, modifier, 
                unit: measureUnit.abbreviation,
                portionDescription: '',
            };
            return portion;
        }),
        nutrients: foodNutrients.map(({amount, nutrient: nutrientDetail}) => {
            const {name, unitName} = nutrientDetail;
            const nutrient: Nutrient = {
                amount, unitName, name,
            };
            return nutrient;
        }),
    }
    return food;
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
    }, [state.apiKey, sanity]);
    
    const [isBusy, setIsBusy] = useState(true);

    useEffect(() => {
        setIsBusy(state.client !== ClientState.ready);
    }, [state]);

    async function fetchFdcId (fdcId: string): Promise<Food | null> {
        // see if requested food already exists in db
        

        dispatch(fetchAction());
        const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${state.apiKey}`;
        console.log('fetching: ', url);

        let food: Food | null = null;

        try {
            const res = await fetch(url);
            const usdaFood: USDAFood = await res.json();

            food = mapFood(usdaFood);

            console.log(food);

            dispatch(fetchSuccessAction());
        } catch (error) {
            dispatch(fetchErrorAction(error?.toString() ?? 'unknown error'));            
        }
                
        return food;
    }

    return {fetchFdcId, isBusy};
}
