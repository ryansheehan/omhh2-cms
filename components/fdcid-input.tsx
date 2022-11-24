import {ChangeEvent, FC, useCallback, useState} from 'react';
import {StringInputProps, set, unset} from 'sanity';
import {TextInput, Card, Flex, Button, Spinner} from '@sanity/ui';
import {useUsdaClient} from '../hooks/useUsdaClient';

export const FdcIdInput: FC<StringInputProps> = (props) => {
    const {
        elementProps,
        onChange,
        value = '',
    } = props; 
    
    const {fetchFdcId, isBusy: fetchBusy} = useUsdaClient(); 
    const [fdcid, setFdcid] = useState('');

    const handleFdcidChange = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
        setFdcid(target.value.trim());
    }, [setFdcid])

    const handleFindFdcid = useCallback(async () => {
        const food = await fetchFdcId(fdcid);
        console.log('got food', food);
    }, [fdcid, fetchFdcId])

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.currentTarget.value;        
        onChange(nextValue ? set(nextValue) : unset());
    }, [onChange])


    return (
        <> 
            <Flex direction="row" align={'center'} gap={4}>                            
                <Card flex={1}>
                    <TextInput placeholder='fdc id' onChange={handleFdcidChange} />
                </Card>
                { fetchBusy ? 
                    <Spinner muted/> : 
                    <Button  onClick={handleFindFdcid} text="Find" disabled={fdcid.length === 0} />
                }
                
            </Flex>     
            <TextInput {...elementProps} onChange={handleChange} value={value} style={{display: "none"}}/>
        </>
    )
}

FdcIdInput.displayName = 'USDAFoodPicker'
