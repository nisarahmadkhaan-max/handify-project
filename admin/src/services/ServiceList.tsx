import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  SelectInput,
  TextInput,
  ImageField,
} from 'react-admin';

const serviceFilters = [
    <TextInput source="q" label="Search Name" alwaysOn />,
    <SelectInput source="category" choices={[
        { id: 'Cleaning', name: 'Cleaning' },
        { id: 'Plumbing', name: 'Plumbing' },
        { id: 'Electrician', name: 'Electrician' },
        { id: 'Painting', name: 'Painting' },
        { id: 'Carpentry', name: 'Carpentry' },
        { id: 'Pest Control', name: 'Pest Control' },
        { id: 'Welding', name: 'Welding' },
        { id: 'House Keeping', name: 'House Keeping' },
    ]} />
];

export const ServiceList = () => (
  <List filters={serviceFilters} sort={{ field: 'category', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <ImageField source="imageUrl" title="name" sx={{ '& img': { width: 50, height: 50, borderRadius: '4px' } }} />
      <TextField source="category" sx={{ fontWeight: 'bold', color: '#1976d2' }} />
      <NumberField
        source="price"
        options={{ style: 'currency', currency: 'PKR' }}
        sx={{ fontWeight: 'bold' }}
      />
      <TextField source="description" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
