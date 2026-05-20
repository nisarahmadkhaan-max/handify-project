import { Edit, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const ServiceEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <TextInput source="imageUrl" label="Image URL" />
      <TextInput source="category" />
      <NumberInput source="price" />
    </SimpleForm>
  </Edit>
); 