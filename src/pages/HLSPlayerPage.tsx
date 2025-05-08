import HlsPlayer from '../components/hlsPlayer/HLSPlayer'
import withBasePage from './withBasePage';
import WebcamStreamer from '../components/RTMPStreamer/WebcamStreamer';
import { useEffect, useState } from 'react';
import useDevice from '../hooks/useDevice';
import { useParams } from 'react-router-dom';
import { Device } from '../types';
import { Tabs, Tab, Box } from '@mui/material';
import FileStreamer from '../components/RTMPStreamer/FileStreamer';

function HLSPlayerPage() {
  const [device, setDevice] = useState<Device | undefined>(undefined);
  const [activeTab, setActiveTab] = useState(0);
  const { deviceId } = useParams<{ deviceId: string }>();
  const { devices } = useDevice();

  useEffect(() => {
    if (devices && deviceId) {
      setDevice(devices[deviceId]);
    }
  }, [devices, deviceId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Webcam Stream" />
          <Tab label="File Stream" />
        </Tabs>
      </Box>
      
      {activeTab === 0 ? (
        <WebcamStreamer device={device} />
      ) : (
        <FileStreamer device={device} />
      )}
      
      <HlsPlayer device={device} />
    </div>
  )
}

export default withBasePage(HLSPlayerPage);
