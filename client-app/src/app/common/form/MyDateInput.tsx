import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';
import DatePicker, {ReactDatePickerProps} from 'react-datepicker';


export default function MyDateInput(props: Partial<ReactDatePickerProps>) { // Partial - nogle af dem.  elementer er kun mandatory, hvis vi henter dem
    const [field, meta, helpers]= useField(props.name!); // from formik
    return (
        <Form.Field error={meta.touched && !!meta.error}> {/* !! caster explicit meta.error til boolean. */}
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)} /* var mandatory i ReactDatePickerProps */
            />
            {(meta.touched && !!meta.error)
                ? (<Label basic color='red'>{meta.error}</Label>)
                : null
            }
        </Form.Field>
    )
}