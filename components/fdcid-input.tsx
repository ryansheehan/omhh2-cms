import {FC} from 'react';
import {StringInputProps} from 'sanity';
import {TextInput} from '@sanity/ui';

export const FdcIdInput: FC<StringInputProps> = (props) => {
    const {
        elementProps,
    } = props;

    return (
        <>            
            <TextInput {...elementProps} />
        </>
    )
}

FdcIdInput.displayName = 'USDAFoodPicker'
