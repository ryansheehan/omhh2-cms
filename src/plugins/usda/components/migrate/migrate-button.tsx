import {FC, useState, useEffect} from 'react';
import {useClient} from 'sanity';
import {Button, Container, Card, Stack, Flex, Text, Heading} from '@sanity/ui';
import data from './migration-data';
import {useUsdaClient} from '../../hooks/useUsdaClient';
import {Portion, genKey} from '../../schemas/portion';

function useArray<T>(): [T[], (item:T) => void] {
    const [items, setItems] = useState<T[]>([]);
    const push = (item:T) => setItems([...items, item]);
    return [items, push];
}

export const MigrateButton: FC = () => {
    const {fetchFdcId} = useUsdaClient(import.meta.env.SANITY_STUDIO_USDA_API_KEY);
    const sanity = useClient({apiVersion: import.meta.env.SANITY_STUDIO_CLIENT_VERSION});

    const [migrationCount, setMigrationCount] = useState(0);
    const [isMigrating, setIsMigrating] = useState(false);   
    const [completed, pushCompleted] = useArray<string>();
    const [notFound, pushNotFound] = useArray<string>();
    const [buttonText, setButtonText] = useState('Do Migration');
    
    const dataLength = data.length;

    const doMigration = async () => {
        setIsMigrating(true);

        for await (const {fdc_id: fdcidNum, portions: oldPortions} of data) {
            const fdcid = fdcidNum.toString();
            const food = await fetchFdcId(fdcid);
            if (food) {
                const portions: Portion[] = [];
                if (oldPortions?.length) {
                    oldPortions.forEach(({amount, gram_weight: gramWeight, modifier = '', portion_description: portionDescription = '', unit}) => {
                        if (amount && gramWeight && unit) {
                            const portion: Portion = {
                                _key: genKey({unit, modifier}),
                                amount, gramWeight, modifier, unit, portionDescription,
                            }
                            portions.push(portion);
                        }
                    });                    
                }
                food.portions = portions;

                const {fdcid: createdFdcId} = await sanity.createIfNotExists(food);
                pushCompleted(createdFdcId);
            } else {
                pushNotFound(fdcid);
            }
            setMigrationCount(migrationCount+1);
        }

        setIsMigrating(false);
    }

    useEffect(() => {
        if (isMigrating) {
            const text = `${migrationCount} of ${dataLength} migrated`;
            setButtonText(text);
        } else {
            setButtonText('Do Migration');
        }
    }, [isMigrating, migrationCount])

    return (
        <Card display="flex" tone="positive" padding={4} flex={1}> 
            <Flex direction="column" align="stretch" flex={1} gap={4}>
                <Button text={buttonText} disabled={isMigrating} mode="ghost" onClick={() => doMigration()}/>
                <Flex flex={1}>
                    <Container flex={1}>
                        <Heading as="h2" size={2} align="center">Completed ({completed.length})</Heading>
                        <Stack as="ul" space={2} display="flex">
                            {completed.map(id => <Text as="li" key={id} size={1}>{id}</Text>)}
                        </Stack>
                    </Container>
                    
                    <Container flex={1}>
                        <Heading as="h2" size={2}  align="center">Not Found ({notFound.length})</Heading>
                        <Stack as="ul" space={2} display="flex">
                            {notFound.map(id => <Text as="li" key={id} size={1}>{id}</Text>)}
                        </Stack>
                    </Container>
                </Flex>
            </Flex>
        </Card>
    )
};
