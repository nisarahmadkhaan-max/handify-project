import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" />
      <TextInput source="image" />
      <TextInput source="description" />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
); 