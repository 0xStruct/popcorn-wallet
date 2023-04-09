import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { useState } from "react";

type ScreenProps = {
  setScreen: (newStep: number) => void;
};

const TopupScreen = ({ setScreen }: ScreenProps) => {
  const {
    openStripeWidget,
    closeStripeWidget,
    safeSelected,
    chain,
    chainId,
    isAuthenticated,
    loginWeb3Auth,
  } = useAccountAbstraction();

  const [showStripeWidget, setShowStripeWidget] = useState<boolean>(false);

  if(!isAuthenticated) setScreen(0);

  return (
    <>
      <Typography variant="h2" component="h1">
        Topup with Fiat
      </Typography>

      <Typography marginTop="16px">
        Allow gamers to buy in with fiat cards. Below is the demo with Stripe.
      </Typography>

      <Typography marginTop="16px">
        There are now many available fiat on-ramps such as Ramp Network, Moonpay, Transak ...
      </Typography>

      <Divider style={{ margin: "32px 0 28px 0" }} />

      
      {/* Stripe widget */}
      <ConnectedContainer
        display="flex"
        flexDirection="column"
        justifyContent="left"
        alignItems="left"
        gap={1}
      >
        <Typography fontWeight="700">Stripe widget</Typography>

        <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
          This widget is on testmode, you will need to use{" "}
          <Link
            href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit#considerations-and-limitations"
            target="_blank"
          >
            fake data
          </Link>{" "}
          in order to simulate the process. Available only in the United
          States.
        </Typography>

        {!showStripeWidget ? (
          <Tooltip
            title={
              "buy USDC to your Safe address using Stripe payment provider"
            }
          >
            {/* Buy USDC with our OnRamp kit */}
            <Button
              sx={{width: "60%", margin: "0 auto"}}
              startIcon={<WalletIcon />}
              variant="contained"
              onClick={async () => {
                setShowStripeWidget(true);
                await openStripeWidget();
              }}
              disabled={!chain?.isStripePaymentsEnabled}
            >
              Buy USDC
              {!chain?.isStripePaymentsEnabled
                ? " (only in Mumbai chain)"
                : ""}
            </Button>
          </Tooltip>
        ) : (
          <Stack
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Tooltip title={"close Stripe Widget"}>
              <IconButton
                size="small"
                color="primary"
                sx={{ alignSelf: "flex-end" }}
                onClick={async () => {
                  setShowStripeWidget(false);
                  await closeStripeWidget();
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Stripe root widget */}
            <div id="stripe-root"></div>
          </Stack>
        )}
      </ConnectedContainer>
        
      <Divider style={{ margin: "40px 0 30px 0" }} />

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Code sample (Stripe USDC)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CodeContainer>
          <CodeBlock
            text={code}
            language={"javascript"}
            showLineNumbers
            startingLineNumber={96}
            theme={atomOneDark}
          />
        </CodeContainer>
        </AccordionDetails>
      </Accordion>      

    </>
  );
};

export default TopupScreen;

const code = `import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'

const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  onRampProviderConfig: {
    stripePublicKey: <You public key>, // You should get your own keys from Stripe
    onRampBackendUrl: <Your backend url> // You should deploy your own server
  }
})

const sessionData = await safeOnRamp.open({
  walletAddress,
  networks: ['polygon']
  element: '#stripe-root',
  events: {
    onLoaded: () => console.log('Loaded'),
    onPaymentSuccessful: () => console.log('Payment successful')
    onPaymentError: () => console.log('Payment failed')
    onPaymentProcessing: () => console.log('Payment processing')
  }
})
`;

const ConnectedContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;

  min-height: 265px;
`
);

const CodeContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 16px;
`
);
