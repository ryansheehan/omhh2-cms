import {ChangeEvent, FC, useCallback, useEffect, useRef, useState} from 'react';
import {StringInputProps, set, unset} from 'sanity';
import {TextInput, Card, Flex, Button, Spinner} from '@sanity/ui';
import {useUsdaClient} from '../hooks/useUsdaClient';
import { fromEvent, Subscription } from 'rxjs';
import { map, withLatestFrom, tap } from 'rxjs/operators';

export const FdcIdInput: FC<StringInputProps> = (props) => {
    const {
        elementProps,
        onChange,
        value = '',
    } = props; 
    
    const [hasFdcId, setHasFdcId] = useState(false); 
    const {fetchFdcId, isBusy: fetchBusy} = useUsdaClient(); 
    const fdcidRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        let subs: Subscription[] = [];        

        if(fdcidRef.current && submitRef.current) {    
            const fdcid$ = fromEvent(fdcidRef.current, 'input').pipe(  
                map((event: Event) => (event.target as HTMLInputElement).value.trim()),                                                 
            );

            const hasFdcId$ = fdcid$.pipe(map(fdcid => fdcid.length > 0));

            subs.push(hasFdcId$.subscribe(hasFdcId => setHasFdcId(hasFdcId)));

            const find$ = fromEvent(submitRef.current, 'click').pipe(
                withLatestFrom(fdcid$),
                map(([_, fdcid]) => fdcid)
            );

            subs.push(find$.subscribe(fdcid => fetchFdcId(fdcid)));
        }

        return () => subs.forEach(sub => sub.unsubscribe());
    }, [])

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.currentTarget.value;        
        onChange(nextValue ? set(nextValue) : unset());
    }, [onChange])


    return (
        <> 
            <Card>
                <Flex direction="row">                            
                    <Card flex={1}>
                        <TextInput ref={fdcidRef} placeholder='fdc id' />
                    </Card>
                    { fetchBusy ? 
                        <Spinner muted/> : 
                        <Button ref={submitRef} text="Find" disabled={!hasFdcId} />
                    }
                    
                </Flex>
            </Card>      
            <TextInput {...elementProps} onChange={handleChange} value={value} style={{display: "none"}}/>
        </>
    )
}

FdcIdInput.displayName = 'USDAFoodPicker'
