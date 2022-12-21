import {definePlugin, Tool} from 'sanity';
import {LemonIcon} from '@sanity/icons';
import portion from './schemas/portion';
import nutrient from './schemas/nutrient';
import food from './schemas/food';
import usdaLookup from './components/usda-lookup';

const tool: Tool = {
    name: 'usda',
    title: 'USDA Lookup',
    icon: LemonIcon,
    component: usdaLookup
}

export const usda = definePlugin({
    name: 'usda',
    schema: {
        types: [portion, nutrient, food]
    },
    tools: prev => [...prev, tool]
});
