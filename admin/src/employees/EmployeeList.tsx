import { List, Datagrid, TextField, BooleanField, NumberField } from 'react-admin';

export const EmployeeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" />
                <TextField source="service" label="Specialization" />
                <NumberField source="averageRating" label="Rating" />
                <NumberField source="totalRatings" label="Total Reviews" />
                <TextField source="cnic.number" label="CNIC Number" />
                <BooleanField source="isVerified" label="System Verified" />
            </Datagrid>
        </List>
    );
};
