import { List, Datagrid, TextField, EditButton, TextInput } from 'react-admin';

const settingFilters = [
    <TextInput source="q" label="Search" alwaysOn />
];

export const SettingsList = () => (
    <List filters={settingFilters}>
        <Datagrid rowClick="edit">
            <TextField source="key" />
            <TextField source="value" label="Setting Value" />
            <TextField source="description" />
            <EditButton />
        </Datagrid>
    </List>
);
