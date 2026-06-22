import { List, Datagrid, TextField, NumberField, ImageField, SelectField, EditButton, DeleteButton, ReferenceField } from 'react-admin';

export const TopupList = () => (
    <List>
        <Datagrid>
            <ReferenceField source="employeeId" reference="employees">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="amount" />
            <TextField source="transactionId" />
            <ImageField source="screenshot" title="Payment Receipt" sx={{ '& img': { maxWidth: 100, maxHeight: 100 } }} />
            <SelectField source="status" choices={[
                { id: 'pending', name: 'Pending' },
                { id: 'approved', name: 'Approved' },
                { id: 'rejected', name: 'Rejected' },
            ]} />
            <TextField source="createdAt" label="Submitted At" />
            <EditButton />
            <DeleteButton mutationMode="pessimistic" />
        </Datagrid>
    </List>
);
