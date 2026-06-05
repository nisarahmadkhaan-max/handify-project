import { List, Datagrid, TextField, BooleanField, NumberField, ImageField } from 'react-admin';

export const EmployeeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <ImageField source="profileImage" label="DP" sx={{ '& img': { width: 40, height: 40, borderRadius: '50%' } }} />
                <TextField source="name" />
                <TextField source="service" label="Specialization" />
                <NumberField source="averageRating" label="Rating" />
                <NumberField source="totalRatings" label="Total Reviews" />
                <BooleanField source="isVerified" label="System Verified" />
            </Datagrid>
        </List>
    );
};
