import {useMemo} from 'react';
import {useClient} from 'sanity';

export function useSanityClient() {
    const client = useClient({apiVersion: import.meta.env.SANITY_STUDIO_CLIENT_VERSION});
    return useMemo(() => client, [client]);
}
