import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchFormProps {
  initialQuery?: string;
  initialType?: string;
  onSearch: (query: string, type: string) => void;
}

const SearchForm = ({ initialQuery = '', initialType = 'release', onSearch }: SearchFormProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, type);
      // 更新 URL 以反映搜索参数
      navigate(`/search/${encodeURIComponent(query)}?type=${type}`);
    }
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        my: 4,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for albums, artists, or labels..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1 }}
      />
      
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="search-type-label">Type</InputLabel>
        <Select
          labelId="search-type-label"
          id="search-type"
          value={type}
          label="Type"
          onChange={handleTypeChange}
        >
          <MenuItem value="release">Releases</MenuItem>
          <MenuItem value="master">Masters</MenuItem>
          <MenuItem value="artist">Artists</MenuItem>
        </Select>
      </FormControl>
      
      <Button 
        type="submit" 
        variant="contained" 
        size="large"
        sx={{ 
          height: { md: '56px' },
          px: 4,
          whiteSpace: 'nowrap',
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchForm;