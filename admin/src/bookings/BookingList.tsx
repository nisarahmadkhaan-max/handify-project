import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Filter,
  SearchInput,
  SelectInput,
  ShowButton,
  useRecordContext,
} from 'react-admin';
import { Chip } from '@mui/material';

const BookingFilter = (props: any) => (
  <Filter {...props}>
    <SearchInput source="q" placeholder="Search bookings..." alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'pending', name: 'Pending' },
        { id: 'confirmed', name: 'Confirmed' },
        { id: 'completed', name: 'Completed' },
        { id: 'cancelled', name: 'Cancelled' },
        { id: 'all', name: 'All Statuses' },
      ]}
      alwaysOn
    />
  </Filter>
);

const StatusField = (props: { label?: string, source?: string }) => {
  const record = useRecordContext();
  if (!record || !record.status) return <span>-</span>;
  const colors: any = { pending: 'warning', confirmed: 'success', completed: 'info', cancelled: 'error' };
  return (
    <Chip
      label={record.status.toUpperCase()}
      color={colors[record.status.toLowerCase()] || 'default'}
      size="small"
    />
  );
};

export const BookingList = (props: any) => {
  return (
    <List {...props} filters={<BookingFilter />} filterDefaultValues={{ status: 'pending' }}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="service" label="Service" />
        <NumberField source="basePrice" label="Base (Worker)" />
        <NumberField source="commissionAmount" label="Comm. (App)" />
        <NumberField source="finalPrice" label="Total (User)" sx={{ fontWeight: 'bold' }} />
        <TextField source="location" label="Location" />
        <StatusField label="Status" />
        <DateField source="date" label="Job Date" />
        <ShowButton label="View" />
      </Datagrid>
    </List>
  );
};
