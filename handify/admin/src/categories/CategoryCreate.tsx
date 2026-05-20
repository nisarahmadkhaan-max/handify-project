import { Create, SimpleForm, TextInput, BooleanInput } from 'react-admin';

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="image" />
      <TextInput source="description" />
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
); 