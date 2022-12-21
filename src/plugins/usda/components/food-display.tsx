import {FC} from 'react';
import {Food} from '../schemas/food';
import {Card, Container, Text, Label, Grid, Stack} from '@sanity/ui';

interface Props {
    food: Food;
}

export const FoodDisplay: FC<Props> = ({food}: Props) => {
    const {
        description,
        fdcid,
        ndbNumber,
        nutrients,
        portions,
        source,
        usdaPublicationDate,
    } = food;

    const sourceName = source.split('_');

    return (
        <Container display="flex">
            <Card>
                <Grid columns={2} gapY={2} gapX={3}>
                    <Label align="right">Description</Label>
                    <Text>{description}</Text>
                    <Label align="right">FDC ID</Label>
                    <Text>{fdcid}</Text>
                    <Label align="right">NDB Number</Label>
                    <Text>{ndbNumber}</Text>
                    <Label align="right">Source</Label>
                    <Text>{sourceName}</Text>
                    <Label align="right">Publication Date</Label>
                    <Text>{usdaPublicationDate}</Text>
                    <Label align="right">Portions</Label>
                    {portions?.length ?
                        <ul>
                            {portions.map(({amount, unit, modifier, gramWeight}) => {
                                const portion = `${amount} ${unit}${modifier ? ` ${modifier}` : ''} = ${gramWeight}`
                                return (
                                    <li key={`${unit} ${modifier}`}><Text size={1}>{portion}</Text></li>
                                )
                            })}
                        </ul> : 
                        <Text>&lt;none&gt;</Text>
                    }
                    <Label align="right">Nutrients</Label>
                    <Stack as="ul" space={2}>
                        {nutrients.map(({name, amount, unitName}) => {
                            const nutrient = `${name} (${amount} ${unitName})`
                            return (
                                <Text key={name} as="li" size={1}>{nutrient}</Text>
                            )
                        })}
                    </Stack>
                </Grid>
            </Card>
        </Container>
    )
}