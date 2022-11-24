import {defineField, defineType} from 'sanity'
import {FdcIdInput} from '../components/fdcid-input';

import type {Nutrient} from './nutrient';
export type {Nutrient} from './nutrient';
import type {Portion} from './portion';
export type {Portion} from './portion';


export type FoodSource = 'custom'
    | 'agricultural_acquisition'
    | 'branded_food'
    | 'experimental_food'
    | 'foundation_food'
    | 'market_acquisition'
    | 'sample_food'
    | 'sr_legacy_food'
    | 'sub_sample_food'
    | 'survey_fndds_food';

export interface Food {
    description: string;
    fdcid: string;
    source: FoodSource;
    portions: Portion[];
    nutrients: Nutrient[];
    usdaPublicationDate: string;
}

export default defineType({
    name: 'food',
    title: 'Food',
    type: 'document',
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
            components: {
                input: FdcIdInput,
            }
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

        defineField({
            name: 'usdaPublicationDate',
            title: 'USDA Publication Date',
            type: 'string',
            hidden: true,
        }),
    ],

    preview: {
        select: {
            title: 'description',
            subtitle: 'fdc_id',
        }
    }
})