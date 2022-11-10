import {defineType, defineField} from 'sanity';

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
            name: 'unit_name',
            title: 'Unit',
            type: 'string',
        }),        
    ],
    preview: {
        select: {
            name: 'name',
            amount: 'amount',
            unit: 'unit_name',
        },
        prepare: (({name, amount, unit}) => ({
            title: name, 
            subtitle: `${amount} ${unit.toLowerCase()}`,
        }))
    }
})