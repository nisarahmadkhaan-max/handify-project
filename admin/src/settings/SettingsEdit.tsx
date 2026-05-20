import { Edit, SimpleForm, TextInput } from 'react-admin';

export const SettingsEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="key" disabled />
            <TextInput source="value" label="Setting Value" fullWidth />
            <TextInput source="description" fullWidth multiline />
        </SimpleForm>
    </Edit>
);
