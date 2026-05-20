import {
  List,
  Datagrid,
  TextField,
  ImageField,
  BooleanField,
  EditButton,
  DeleteButton,
  TextInput,
} from 'react-admin';

const categoryFilters = [
  <TextInput label="Search by name" source="name" alwaysOn />,
];

export const CategoryList = () => (
  <List filters={categoryFilters}>
    <Datagrid>
      <TextField source="name" />
      <ImageField source="image" title="title" />
      <TextField source="description" />
      <BooleanField source="isActive" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
); 