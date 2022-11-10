import {defineField, defineType} from 'sanity';

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
            name: 'gram_weight',
            title: 'Grams',
            type: 'number',
        }),

        defineField({
            name: 'portion_description',
            title: 'Portion Description',
            type: 'string',
        }),

        defineField({
            name: 'modifier',
            title: 'Modifier',
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