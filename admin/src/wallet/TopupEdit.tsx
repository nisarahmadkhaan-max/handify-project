import { Edit, SimpleForm, TextInput, NumberInput, SelectInput, ImageField } from 'react-admin';

export const TopupEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <NumberInput source="amount" disabled />
            <TextInput source="transactionId" disabled />
            <ImageField source="screenshot" title="Payment Receipt" />
            <SelectInput source="status" choices={[
                { id: 'pending', name: 'Pending' },
                { id: 'approved', name: 'Approved' },
                { id: 'rejected', name: 'Rejected' },
            ]} />
            <TextInput source="adminNotes" label="Reason (if rejected)" fullWidth multiline />
        </SimpleForm>
    </Edit>
);
