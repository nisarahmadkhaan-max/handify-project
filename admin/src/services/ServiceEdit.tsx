import { Edit, SimpleForm, TextInput, NumberInput, SelectInput } from 'react-admin';

const categories = [
    { id: 'Cleaning', name: 'Cleaning' },
    { id: 'Plumbing', name: 'Plumbing' },
    { id: 'Electrician', name: 'Electrician' },
    { id: 'Painting', name: 'Painting' },
    { id: 'Carpentry', name: 'Carpentry' },
    { id: 'Pest Control', name: 'Pest Control' },
    { id: 'Welding', name: 'Welding' },
    { id: 'House Keeping', name: 'House Keeping' },
];

export const ServiceEdit = () => (
  <Edit title="Edit Service Price & Details">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth />
      <SelectInput source="category" choices={categories} fullWidth />
      <NumberInput source="price" label="Base Price (PKR)" fullWidth />
      <TextInput source="description" multiline fullWidth />
      <TextInput source="imageUrl" label="Image URL" fullWidth />
    </SimpleForm>
  </Edit>
);
