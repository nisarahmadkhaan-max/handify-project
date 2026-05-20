import { Edit, SimpleForm, TextInput, BooleanField, useRecordContext } from 'react-admin';
import { Box, Typography, Grid, Paper, Link } from '@mui/material';

const backendUrl = 'http://localhost:3000';

const ImagePreview = ({ source, title }: { source: string, title: string }) => {
    const record = useRecordContext();
    if (!record) return null;

    // Safely get nested value and cast to any to satisfy TypeScript
    const value = source.split('.').reduce((obj: any, key: string) => obj?.[key], record) as any;

    if (!value || typeof value !== 'string' || value.trim() === '') {
        return (
            <Box sx={{ p: 4, border: '2px dashed #ddd', borderRadius: '12px', mt: 1, backgroundColor: '#fdfdfd', textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">No Document Uploaded</Typography>
            </Box>
        );
    }

    // Identify if it's base64 (from app) or a relative path (from seeder)
    const isBase64 = value.startsWith('data:');
    const imgSrc = isBase64 ? value : `${backendUrl}/${value.replace(/^\//, '')}`;

    return (
        <Box sx={{ mt: 1 }}>
            <Link href={imgSrc} target="_blank" rel="noopener noreferrer" underline="none">
                <Box sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #e0e0e0',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        borderColor: '#1976d2',
                        cursor: 'zoom-in'
                    }
                }}>
                    <img
                        src={imgSrc}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '280px',
                            display: 'block',
                            objectFit: 'contain',
                            padding: '10px'
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        p: 0.5,
                        fontSize: '10px',
                        textAlign: 'center'
                    }}>
                        Click to View Full Size
                    </Box>
                </Box>
            </Link>
        </Box>
    );
};

export const EmployeeEdit = () => (
    <Edit title="Review Professional Documents">
        <SimpleForm toolbar={false}>
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
                Professional Verification View
            </Typography>

            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Basic Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextInput source="name" label="Full Name" disabled fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextInput source="service" label="Specialization" disabled fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextInput source="cnic.number" label="CNIC Number" disabled fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>System Verification Status:</Typography>
                            <BooleanField source="isVerified" />
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                            Note: This account is automatically verified by the system using OCR and Face Matching.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Legal Documents (CNIC & Security Selfie)
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>CNIC Front</Typography>
                        <ImagePreview source="cnic.frontImage" title="CNIC Front" />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>CNIC Back</Typography>
                        <ImagePreview source="cnic.backImage" title="CNIC Back" />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '2px solid #fee2e2', bgcolor: '#fffafa', borderRadius: '12px' }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>Verification Selfie</Typography>
                        <ImagePreview source="cnic.selfieWithCnic" title="Selfie" />
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Emergency Contact Info
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <TextInput source="emergencyContact.name" label="Contact Person" disabled sx={{ flex: 1 }} />
                <TextInput source="emergencyContact.phoneNumber" label="Phone Number" disabled sx={{ flex: 1 }} />
            </Box>
        </SimpleForm>
    </Edit>
);
