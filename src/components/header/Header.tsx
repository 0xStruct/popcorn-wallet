import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DarkThemeIcon from "@mui/icons-material/Brightness4";
import LightThemeIcon from "@mui/icons-material/Brightness7";

import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/LogoutRounded";

import ChainLabel from "src/components/chain-label/ChainLabel";
import { useTheme } from "src/store/themeContext";

import SafeInfo from "src/components/safe-info/SafeInfo";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";

type HeaderProps = {
  setScreen: (newStep: number) => void;
};

function Header({ setScreen }: HeaderProps) {
  const { switchThemeMode, isDarkTheme } = useTheme();

  const { loginWeb3Auth, logoutWeb3Auth, isAuthenticated, safeSelected, chainId, chain } =
    useAccountAbstraction();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          {/* App Logo */}
          <Tooltip title="🍿 Popcorn embedded wallet">
            <Box>
              <div
                style={{ cursor: "pointer", fontSize: "26px", marginRight: "4px", }}
                onClick={() => setScreen(0)} // go to Home
              >🍿 Popcorn</div>
            </Box>
          </Tooltip>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexGrow={1}
            gap={1}
          >
            {/* chain label */}
            {/*chain && (
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <ChainLabel chain={chain} />
              </Box>
            )*/}

            {isAuthenticated ? (
              <>
              {safeSelected && (
                <SafeInfo safeAddress={safeSelected} chainId={chainId} />
              )}
              <LogoutIconButton onClick={logoutWeb3Auth}>
                <LogoutIcon fontSize="small" />
              </LogoutIconButton>
              </>
            ) : (
              <Button variant="contained" onClick={loginWeb3Auth} sx={{fontSize: "86%"}}>
                Login
              </Button>
            )}

            {/* Switch Theme mode button */}
            <Tooltip title="Switch Theme mode">
              <IconButton
                sx={{ marginLeft: 0 }}
                size="large"
                color="inherit" 
                aria-label="switch theme mode"
                edge="end"
                onClick={switchThemeMode}
              >
                {isDarkTheme ? <LightThemeIcon /> : <DarkThemeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;

const StyledImg = styled("img")`
  border-radius: 50%;
`;

const LogoutIconButton = styled(IconButton)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  border: 1px solid ${theme.palette.border.light};
  background-color: ${theme.palette.border.light};
  color: ${theme.palette.getContrastText(theme.palette.border.light)}; 
`
);