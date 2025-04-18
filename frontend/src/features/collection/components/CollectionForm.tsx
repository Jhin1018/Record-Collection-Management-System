import { useState, useEffect, useRef } from 'react';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  InputAdornment, 
  FormHelperText,
  Button,
  Box,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save as SaveIcon } from '@mui/icons-material';

export interface CollectionFormData {
  quantity: number;
  purchase_price: string | number;
  purchase_date: Date;
  description: string;
}

interface CollectionFormProps {
  initialData: CollectionFormData;
  releaseTitle?: string;
  releaseArtist?: string;
  releaseYear?: number;
  onSubmit: (formData: CollectionFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const CollectionForm = ({
  initialData,
  releaseTitle,
  releaseArtist,
  releaseYear,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save'
}: CollectionFormProps) => {
  const [formData, setFormData] = useState<CollectionFormData>(initialData);
  const [formErrors, setFormErrors] = useState({
    quantity: false,
    purchase_price: false,
    purchase_date: false,
  });

  const originalDateRef = useRef<Date>(new Date(initialData.purchase_date.getTime()));

  useEffect(() => {
    setFormData(initialData);
    setFormErrors({
      quantity: false,
      purchase_price: false,
      purchase_date: false,
    });
    originalDateRef.current = new Date(initialData.purchase_date.getTime());
  }, [initialData]);

  const handleFormChange = (field: keyof CollectionFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    
    if (field in formErrors) {
      setFormErrors({
        ...formErrors,
        [field]: false,
      });
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData({
        ...formData,
        purchase_date: newDate,
      });
      setFormErrors({
        ...formErrors,
        purchase_date: false,
      });
    }
  };

  const validateForm = () => {
    const errors = {
      quantity: !formData.quantity || formData.quantity < 1,
      purchase_price: !formData.purchase_price || 
        (typeof formData.purchase_price === 'string' && isNaN(parseFloat(formData.purchase_price))),
      purchase_date: !formData.purchase_date,
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submittedData = {
      ...formData,
      purchase_price: typeof formData.purchase_price === 'string' 
        ? parseFloat(formData.purchase_price) 
        : formData.purchase_price
    };
    
    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {(releaseTitle || releaseArtist) && (
        <Box sx={{ mb: 3 }}>
          {releaseTitle && (
            <Typography variant="subtitle1" gutterBottom>
              {releaseTitle}
            </Typography>
          )}
          {releaseArtist && (
            <Typography variant="body2" color="text.secondary">
              {releaseArtist}
              {releaseYear ? ` (${releaseYear})` : ''}
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            required
            value={formData.quantity}
            onChange={handleFormChange('quantity')}
            InputProps={{ inputProps: { min: 1 } }}
            error={formErrors.quantity}
            helperText={formErrors.quantity ? 'Quantity is required' : ''}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required error={formErrors.purchase_price}>
            <InputLabel htmlFor="purchase-price">Purchase Price</InputLabel>
            <OutlinedInput
              id="purchase-price"
              value={formData.purchase_price}
              onChange={handleFormChange('purchase_price')}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Purchase Price"
            />
            {formErrors.purchase_price && (
              <FormHelperText>Valid purchase price is required</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Purchase Date"
              value={formData.purchase_date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: true,
                  error: formErrors.purchase_date,
                  helperText: formErrors.purchase_date ? 'Purchase date is required' : '',
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={handleFormChange('description')}
            placeholder="Add notes about condition, variant, etc. (optional)"
            margin="normal"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {onCancel && (
          <Button onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </Box>
    </form>
  );
};

export default CollectionForm;