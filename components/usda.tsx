import {ForwardedRef, forwardRef} from 'react';
import {TextInput} from '@sanity/ui';

interface Props {

}

const USDAComponent = forwardRef((props: Props, ref: ForwardedRef<{}>) => {
    console.log(props);
    console.log(ref);

    return (
        <>
            <TextInput />
        </>
    )
})

USDAComponent.displayName = 'USDAFoodPicker'

export default USDAComponent;
