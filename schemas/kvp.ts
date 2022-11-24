import { defineType, defineField } from "sanity";

export default defineType({
    name: 'kvp',
    title: 'Key Values',
    type: 'document',
    fields: [
        defineField({
            name: 'key',
            title: 'Key',
            type: 'string',        
        }),
        defineField({
            name: 'value',
            title: 'Value',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'key',
            subtitle: 'value'
        }
    }
})
