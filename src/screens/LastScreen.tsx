import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type ScreenProps = {
  setScreen: (newStep: number) => void;
};

const LastScreen = ({ setScreen }: ScreenProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      paddingTop="72px"
      paddingLeft="100px"
    >
      <Typography variant="h1" fontSize="64px" lineHeight="76px">
        Play Now
      </Typography>

      <Box display="flex" gap={2} marginTop="32px">
        <Button variant="outlined" onClick={() => setScreen(0)}>
          Play Now
        </Button>
      </Box>
    </Box>
  );
};

export default LastScreen;
