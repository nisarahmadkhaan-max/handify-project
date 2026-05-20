import { List, Datagrid, TextField, BooleanField } from 'react-admin';

export const EmployeeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" />
                <TextField source="service" label="Specialization" />
                <TextField source="cnic.number" label="CNIC Number" />
                <BooleanField source="isVerified" label="System Verified" />
            </Datagrid>
        </List>
    );
};
