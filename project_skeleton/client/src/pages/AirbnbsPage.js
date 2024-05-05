import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, Grid, TextField, Slider, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import ListingCard from '../components/ListingCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function AirbnbsPage() {

  const [pageSize, setPageSize] = useState(10);
  const [listings, setListings] = useState([]);

  const [title, setTitle] = useState('');
  const [stars, setStars] = useState([0, 5]);
  const [bedrooms, setBedrooms] = useState([0, 10]);
  const [bathrooms, setBathrooms] = useState([0, 10]);
  const [minNights, setMinNights] = useState([0, 30]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
      .then(res => res.json())
      .then(resJson => {
        setListings(resJson.map(listing => ({ id: listing.id, ...listing })));
      });
  }, []);

  const fetchListings = () => {
    const query = `title=${title}&star_low=${stars[0]}&star_high=${stars[1]}&bedroom_low=${bedrooms[0]}&bedroom_high=${bedrooms[1]}&bathroom_low=${bathrooms[0]}&bathroom_high=${bathrooms[1]}&min_night_low=${minNights[0]}&min_night_high=${minNights[1]}`;
    fetch(`http://${config.server_host}:${config.server_port}/search_listing?${query}`)
      .then(res => res.json())
      .then(resJson => {
        setListings(resJson.map(listing => ({ id: listing.id, ...listing })));
      });
  }

  const columns = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'stars', headerName: 'Stars', width: 100 },
    { field: 'bedrooms', headerName: 'Bedrooms', width: 100 },
    { field: 'bathrooms', headerName: 'Bathrooms', width: 100 },
    { field: 'minNights', headerName: 'Minimum Nights', width: 120 },
  ];


  return (
    <Container>
      <h2>Search Airbnb Listings</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Star Rating</Typography>
          <Slider
            value={stars}
            onChange={(e, newValue) => setStars(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={5}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Bedrooms</Typography>
          <Slider
            value={bedrooms}
            onChange={(e, newValue) => setBedrooms(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Bathrooms</Typography>
          <Slider
            value={bathrooms}
            onChange={(e, newValue) => setBathrooms(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Minimum Nights</Typography>
          <Slider
            value={minNights}
            onChange={(e, newValue) => setMinNights(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={30}
          />
        </Grid>
      </Grid>
      <Button onClick={fetchListings} style={{ marginTop: 20 }}>Search</Button>
      <h2>Results</h2>
      <DataGrid
        rows={listings}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}