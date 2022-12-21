import {ChangeEvent, FC, useCallback, useState, useRef} from 'react';
import {SearchIcon} from '@sanity/icons';
import { useUsdaClient } from '../hooks/useUsdaClient';
import {
    Box, Flex, TextInput, 
    Button, Label, Stack,
    Spinner, Card, Text,
    Container, useToast
} from '@sanity/ui';
import { Food } from '../schemas/food';
import {FoodDisplay} from './food-display';
import { AddFoodButton } from './import-food-button';

const usdaApiKey = import.meta.env.SANITY_STUDIO_USDA_API_KEY;

const USDALookup: FC = () => {
    const {fetchFdcId, isBusy} = useUsdaClient(usdaApiKey);
    const [fdcid, setFdcid] = useState('');
    const [food, setFood] = useState<Food|null>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    const handleFdcidChange = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
        setFdcid(target.value.trim());
    }, [setFdcid]);

    const handleFindFdcid = useCallback(async () => {
        const fetchedFood = await fetchFdcId(fdcid);

        if (!fetchedFood) {
            throw new Error('unable to find food');
        }

        console.log('got food', fetchedFood);

        setFood(fetchedFood);

    }, [fdcid, fetchFdcId]);

    const toast = useToast();
    const handleAddCallback = useCallback(({description}:Food) => {
        toast.push({
            closable: true,
            title: `Added ${description}`,
        });
        setFood(null);
        const textInput = textInputRef.current!;
        textInput.value = '';
    }, [textInputRef, toast, setFood]);

    return (
        <Box padding={4} flex={1}>
            <Flex direction="column" align="flex-end" gap={2}>
                <Flex justify="flex-end" align="flex-start" gap={2}>
                    <Flex direction="column" align="flex-end" gap={1}>
                        <TextInput ref={textInputRef} placeholder='FDC ID' onChange={handleFdcidChange}/>
                        <Label muted={true} size={2}>
                            <a href="https://fdc.nal.usda.gov/index.html" rel="noreferrer" target="_blank">Lookup FDC ID</a>
                        </Label>
                    </Flex>
                    <Button onClick={handleFindFdcid}
                        icon={isBusy ? <Spinner muted/> : SearchIcon} 
                        disabled={isBusy}                
                        text="Search" 
                        tone="primary" 
                        mode="ghost" 
                    />                
                </Flex>
                <AddFoodButton food={food} addCallback={handleAddCallback} />
            </Flex>
            { food &&  <FoodDisplay food={food} /> }
        </Box>
    )
}

export default USDALookup;
