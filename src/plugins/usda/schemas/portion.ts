import {defineField, defineType} from 'sanity';

export interface Portion {
    amount: number;
    unit: string;
    modifier: string;
    gramWeight: number;
    portionDescription: string;
}

export default defineType({
    name: 'portion',
    title: 'Portion',
    type: 'object',
    fields: [
        defineField({
            name: 'amount',
            title: 'Amount',
            type: 'number',
        }),

        defineField({
            name: 'unit',
            title: 'Unit',
            type: 'string',
        }),

        defineField({
            name: 'modifier',
            title: 'Modifier',
            type: 'string',
        }),

        defineField({
            name: 'gramWeight',
            title: 'Grams',
            type: 'number',
        }),

        defineField({
            name: 'portionDescription',
            title: 'Portion Description',
            description: 'override the unit for viewing',
            type: 'string',
        }),
    ],
    preview: {
      select: {
        unit: 'unit',
        amount: 'amount',
        mass: 'gram_weight',
        modifier: 'modifier'
      },
      prepare: (({ unit, amount, mass, modifier }) => ({
        title: `${amount} ${unit}${modifier ? ` ${modifier}` : ''}`,
        subtitle: `${mass} g`
      }))
    }
});