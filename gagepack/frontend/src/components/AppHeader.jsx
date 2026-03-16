import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import logo from '../assets/selago.png';
import { useNavigate } from 'react-router-dom';

export default function AppHeader({ title }) {
    const navigate = useNavigate();
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Box
                    component="img"
                    src={logo}
                    alt="Company Logo"
                    sx={{ height: 40, mr: 2 }}
                    onClick={() => navigate('/')}
                />

                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>


        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="h6" onClick={() => navigate('/dashboard')} fontWeight="bold">
          Dashboard
        </Typography>
        <Button variant="h5" color= 'default' fontWeight="bold" onClick={() => navigate('/tooling')}>
          Tooling Tracker 
        </Button>

            </Toolbar>
        </AppBar>
    );
}
