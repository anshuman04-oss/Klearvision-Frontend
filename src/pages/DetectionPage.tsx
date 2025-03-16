import { useState } from 'react';
import { Tabs, Tab, Box, Paper, Typography } from '@mui/material';
import ImageUploader from '../components/detection/ImageUploader';
import VideoUploader from '../components/detection/VideoUploader';
import MultiImageUploader from '../components/detection/MultipleImageUploader';
import withBasePage from './withBasePage';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function DetectionPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: '2rem auto', 
      p: 3 
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Typography variant="h4" sx={{ 
          textAlign: 'center', 
          py: 3,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          Media Detection
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            centered
            variant="fullWidth"
          >
            <Tab label="Single Image" />
            <Tab label="Multiple Images" />
            <Tab label="Video" />
          </Tabs>
        </Box>

        <CustomTabPanel value={selectedTab} index={0}>
          <ImageUploader />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={1}>
          <MultiImageUploader />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={2}>
          <VideoUploader />
        </CustomTabPanel>
      </Paper>
    </Box>
  );
}

export default withBasePage(DetectionPage);
