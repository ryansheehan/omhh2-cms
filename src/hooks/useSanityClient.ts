import {useMemo} from 'react';
import {useClient} from 'sanity';

export function useSanityClient() {
    const client = useClient({apiVersion: '2022-11-20'});
    return useMemo(() => client, [client]);
}
