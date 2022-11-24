import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'food',
    title: 'Food',
    type: 'document',
    fieldsets: [
        { name: 'brand', title: 'Brand Info' }
    ],
    fields: [
        defineField({
            name: 'description',
            title: 'Name',
            type: 'string',            
        }),

        defineField({
            name: 'fdcid',
            title: 'FDC ID',
            type: 'string',
            description: 'FDC ID in the USDA database',
        }),

        defineField({
            name: 'source',
            type: 'string',
            description: 'Source of data defined by the USDA, leave blank if custom',
            options: {
                list: [
                { title: 'Custom - Not in USDA database', value: 'custom' },
                { title: 'Agricultural Acquisition', value: 'agricultural_acquisition' },
                { title: 'Branded', value: 'branded_food' },
                { title: 'Experimental', value: 'experimental_food' },
                { title: 'Foundation', value: 'foundation_food' },
                { title: 'Market Acquisition', value: 'market_acquisition' },
                { title: 'Sample', value: 'sample_food' },
                { title: 'SR Legacy', value: 'sr_legacy_food' },
                { title: 'Sub Sample', value: 'sub_sample_food' },
                { title: 'Survey FNDDS', value: 'survey_fndds_food' }
                ],
                layout: 'dropdown',
            },
        }),

        defineField({
            name: 'portions',
            title: 'Portions',
            description: 'maps a measurement back to grams',
            type: 'array',
            of: [{ type: 'portion' }],
            options: {
                sortable: false,
            }
        }),

        defineField({
            name: 'nutrients',
            title: 'Nutrients',
            type: 'array',
            of: [{ type: 'nutrient' }],
            options: {
              sortable: false,
            }
        }),

        // defineField({
        //     name: 'brand_owner',
        //     title: 'Owner',
        //     type: 'string',
        //     fieldset: 'brand',
        // }),

        // defineField({
        //     name: 'brand_name',
        //     title: 'Brand Name',
        //     type: 'string',
        //     fieldset: 'brand',
        // }),

        // defineField({
        //     name: 'subbrand_name',
        //     title: 'Sub-Brand Name',
        //     type: 'string',
        //     fieldset: 'brand',
        // }),

        // defineField({
        //     name: 'serving_size',
        //     title: 'Serving Size',
        //     type: 'number',
        //     fieldset: 'brand',
        // }),

        // defineField({
        //     name: 'serving_size_unit',
        //     title: 'Serving Size Unit',
        //     type: 'string',
        //     fieldset: 'brand',
        // }),

        // defineField({
        //     name: 'household_serving_fulltext',
        //     title: 'Household Serving',
        //     type: 'string',
        //     fieldset: 'brand',
        // }),

    ],

    preview: {
        select: {
            title: 'description',
            subtitle: 'fdc_id',
        }
    }
})