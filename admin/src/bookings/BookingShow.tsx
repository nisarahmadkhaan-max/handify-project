import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  FunctionField,
} from 'react-admin';
import { Chip } from '@mui/material';

export const BookingShow = (props: any) => {
  return (
    <Show {...props} title="Booking Details">
      <SimpleShowLayout>
        <TextField source="id" label="Booking ID" />
        <TextField source="category" label="Category" />
        <TextField source="service" label="Service" />

        <div style={{ display: 'flex', gap: '20px', margin: '10px 0', padding: '10px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
          <NumberField source="basePrice" label="Base Price (Worker)" />
          <NumberField source="commissionAmount" label="Commission (Handify)" />
          <NumberField source="finalPrice" label="Total Price (User)" sx={{ fontWeight: 'bold', color: '#2e7d32' }} />
        </div>

        <FunctionField
          label="Status"
          render={(record: any) => {
            if (!record || !record.status) return <span>-</span>;
            const status = record.status.toLowerCase();
            const colors: any = { pending: 'warning', confirmed: 'success', completed: 'info', cancelled: 'error' };
            return (
              <Chip
                label={record.status.toUpperCase()}
                color={colors[status] || 'default'}
                size="small"
              />
            );
          }}
        />

        <TextField source="completionOTP" label="Completion OTP (For User)" />
        <DateField source="date" label="Service Date" />
        <TextField source="time" label="Scheduled Time" />
        <TextField source="location" label="Customer Location" />
        <TextField source="additionalInstructions" label="Instructions" />
        <DateField source="createdAt" label="Requested On" showTime />
        <DateField source="updatedAt" label="Last Updated" showTime />
      </SimpleShowLayout>
    </Show>
  );
};
