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

// Remove filters for backend, filtering will be handled on frontend
// const serviceFilters = [
//   <TextInput label="Search by name" source="name" alwaysOn />,
// ];

export const ServiceList = () => (
  <List>
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