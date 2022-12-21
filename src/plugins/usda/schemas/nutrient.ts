import {defineType, defineField} from 'sanity';

export interface Nutrient {
    name: string;
    amount: number;
    unitName: string;
}

export default defineType({
    type: 'object',
    name: 'nutrient',
    title: 'Nutrient',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string'
        }),

        defineField({
            name: 'amount',
            title: 'Amount',
            type: 'number',
        }),

        defineField({
            name: 'unitName',
            title: 'Unit',
            type: 'string',
        }),        
    ],
    preview: {
        select: {
            name: 'name',
            amount: 'amount',
            unit: 'unitName',
        },
        prepare: (({name, amount, unit}) => ({
            title: name, 
            subtitle: `${amount} ${unit.toLowerCase()}`,
        }))
    }
})