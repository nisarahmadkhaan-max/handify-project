import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const ServiceCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <TextInput source="imageUrl" label="Image URL" />
      <TextInput source="category" />
      <NumberInput source="price" />
    </SimpleForm>
  </Create>
); 