import {ChangeEvent, FC, useCallback, useState} from 'react';
import {SearchIcon} from '@sanity/icons';
import { useUsdaClient } from '../hooks/useUsdaClient';
import {
    Box, Flex, TextInput, 
    Button, Label, Stack,
    Spinner,
} from '@sanity/ui';

const usdaApiKey = import.meta.env.SANITY_STUDIO_USDA_API_KEY;

const USDALookup = () => {
    const {fetchFdcId, isBusy} = useUsdaClient(usdaApiKey);
    const [fdcid, setFdcid] = useState('');

    const handleFdcidChange = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
        setFdcid(target.value.trim());
    }, [setFdcid]);

    const handleFindFdcid = useCallback(async () => {
        const food = await fetchFdcId(fdcid);

        if (!food) {
            throw new Error('unable to find food');
        }

        console.log('got food', food);

    }, [fdcid, fetchFdcId])

    return (
        <Box padding={4} flex={1}>
            <Flex justify="center" align="center" gap={2}>
                <Flex direction="column" align="flex-end" gap={1}>
                    <TextInput placeholder='FDC ID' onChange={handleFdcidChange}/>
                    <Label muted={true} size={2}>
                        <a href="https://fdc.nal.usda.gov/index.html" rel="noreferrer" target="_blank">USDA Food Search</a>
                    </Label>
                </Flex>
                { isBusy ? 
                    <Spinner muted /> : 
                    <Button 
                        icon={SearchIcon} 
                        text="Search" 
                        tone="primary" 
                        mode="ghost" 
                        disabled={!fdcid}
                        onClick={handleFindFdcid}
                    />
                }
            </Flex>
            <Stack>
                            
            </Stack>
        </Box>
    )
}

export default USDALookup;
