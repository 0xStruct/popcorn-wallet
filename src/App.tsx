import { useCallback, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import "@safe-global/safe-react-components/dist/fonts.css";

// screens
import PlayScreen from "src/screens/PlayScreen";
import NftsScreen from "src/screens/NftsScreen";
import TopupScreen from "src/screens/TopupScreen";
import WalletScreen from "src/screens/WalletScreen";
import LastScreen from "src/screens/LastScreen";

import Header from "src/components/header/Header";
import Providers from "src/components/providers/Providers";

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function App() {
  const [activeScreen, setActiveScreen] = useState(0);

  const setScreen = useCallback((newScreen: number) => {
    setActiveScreen(newScreen);
  }, []);

  const ActiveScreenComponent = screens[activeScreen].component;

  return (
    <Providers>
      <Box
        maxWidth="sm"
        margin="20px auto"
        padding="8px"
      >
        <CssBaseline />

        {/* App header */}
        <Header setScreen={setScreen} />

        <Box
          display="flex"
          gap={0}
          alignItems="flex-start"
          maxWidth="sm"
          margin="30px auto 40px auto"
        >
          <main style={{ width: "100%", padding: "8px", }}>
            {/* Active Step Component */}
            <ActiveScreenComponent setScreen={setScreen} />
          </main>

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, }} elevation={3}>
            <BottomNavigation
              showLabels
              value={activeScreen}
              onChange={(event, newValue) => {
                setScreen(newValue);
              }}
            >
              <BottomNavigationAction label="Play" icon={<SportsEsportsIcon />} />
              <BottomNavigationAction label="NFTs" icon={<CategoryIcon />} />
              <BottomNavigationAction label="Wallet" icon={<AccountBalanceWalletIcon/>} />
              <BottomNavigationAction label="Topup" icon={<ShoppingCartIcon />} />
            </BottomNavigation>
          </Paper>
        </Box>
        
      </Box>
    </Providers>
  );
}

export default App;

const screens = [
  {
    component: PlayScreen,
  },
  {
    component: NftsScreen,
    nextLabel: "",
  },
  {
    component: WalletScreen,
    nextLabel: "",
  },
  {
    component: TopupScreen,
    nextLabel: "",
  },
  {
    component: LastScreen,
  },
];
