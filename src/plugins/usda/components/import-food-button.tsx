import {FC, useCallback, useState} from 'react';
import {Food} from '../schemas/food';
import {Button} from '@sanity/ui';
import {AddCircleIcon} from '@sanity/icons';
import {useClient} from 'sanity';

interface Props {
    addCallback?: (food: Food)=>void;
    food: Food | null | undefined;    
}

export const AddFoodButton: FC<Props> = ({food, addCallback}) => {
    const client = useClient({apiVersion: import.meta.env.SANITY_STUDIO_CLIENT_VERSION});
    const [isBusy, setIsBusy] = useState(false);

    const handleClick = useCallback(async () => {
        if (food) {
            setIsBusy(true);
    
            // try and add food
            const createdFood = await client.createIfNotExists<Food>(food);        
    
            setIsBusy(false);
    
            // callback if it exists
            if(addCallback) {
                addCallback(createdFood);
            }
        }
    }, [client, addCallback, food])

    return <Button onClick={handleClick} 
        icon={AddCircleIcon} 
        disabled={isBusy || !food} 
        tone="primary" 
        text={isBusy ? 'Importing...': 'Import'}
    />
}
