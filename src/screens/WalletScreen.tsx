import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import SendIcon from "@mui/icons-material/SendRounded";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { utils } from "ethers";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AddressLabel from "src/components/address-label/AddressLabel";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";

import CovalentTokens from "src/components/covalent/Tokens";

const transferAmount = 0.001;

type ScreenProps = {
  setScreen: (newStep: number) => void;
};

const WalletScreen = ({ setScreen }: ScreenProps) => {
  const {
    chainId,
    chain,

    safeSelected,
    safeBalance,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,

    isAuthenticated,
  } = useAccountAbstraction();

  const [transactionHash, setTransactionHash] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");

  if(!isAuthenticated) setScreen(0);


  useEffect(() => {
    console.log("tx hash: ", transactionHash)
  }, [transactionHash])

  useEffect(() => {
    console.log("tx status: ", transactionStatus)
    if(transactionStatus === "ExecSuccess") {
    }
  }, [transactionStatus])

  // TODO: ADD PAY FEES USING USDC TOKEN

  const hasNativeFunds =
    !!safeBalance &&
    Number(utils.formatEther(safeBalance || "0")) > transferAmount;

  return (
    <>
      <Typography variant="h2" component="h1">
        Wallet
      </Typography>

      <Typography marginTop="16px">
        Wallet is built using Covalent API, which support numerous EVM networks.
      </Typography>
      
      <Typography marginTop="16px">
        Transactions interacting with game contract are gasless as they are sponspored by the game through Gelato relayer and its 1balance.
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Find more info at:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://www.covalenthq.com/docs/api/"
          target="_blank"
        >
          Covalent API
        </Link>

        <Link
          href="https://www.gelato.network/relay"
          target="_blank"
        >
          Gelato Gasless Relayer
        </Link>
      </Stack>

      <Divider sx={{ margin: "32px 0 28px 0" }} />

      {/* Tokens */}
      <ConnectedContainer
        display="flex"
        flexDirection="column"
        justifyContent="left"
        alignItems="left"
        gap={1}
      >
        <Typography fontWeight="700">Tokens of the embedded wallet (via Covalent)</Typography>

        <CovalentTokens wallet={safeSelected} chainId={chainId} />

      </ConnectedContainer>

      <Divider sx={{ margin: "32px 0 28px 0" }} />

      {/* Relay Transaction */}
      <ConnectedContainer
        display="flex"
        flexDirection="column"
        justifyContent="left"
        alignItems="left"
        gap={1}
      >
        <Typography fontWeight="700">Relayed / sponsored transaction (via Gelato)</Typography>

        <>
          {/* send fake transaction to Gelato relayer */}
          <Button
            sx={{width: "60%", margin: "0 auto"}}
            startIcon={<SendIcon />}
            variant="contained"
            disabled={!hasNativeFunds}
            onClick={relayTransaction}
          >
            Send Transaction
          </Button>

          {!hasNativeFunds && chain?.faucetUrl && (
            <Link href={chain.faucetUrl} target="_blank">
              Request 0.5 {chain.token}.
            </Link>
          )}
        </>


        {/* Transaction details */}
        <Stack gap={0.5} display="flex" flexDirection="column">
          <Typography fontSize="12px">
            Transfer {transferAmount} {chain?.token}
          </Typography>

          {safeSelected && (
            <Stack gap={0.5} display="flex" flexDirection="row">
              <AddressLabel
                address={safeSelected}
                showCopyIntoClipboardButton={false}
              />

              <ArrowRightAltRoundedIcon />

              <AddressLabel
                address={safeSelected}
                showCopyIntoClipboardButton={false}
              />
            </Stack>
          )}
        </Stack>

        {/* Gelato status label */}
        {gelatoTaskId && (
          <GelatoTaskStatusLabel
            gelatoTaskId={gelatoTaskId}
            chainId={chainId}
            setTransactionHash={setTransactionHash}
            transactionHash={transactionHash}
            setTransactionStatus={setTransactionStatus}
          />
        )}

        {isRelayerLoading && (
          <LinearProgress sx={{ alignSelf: "stretch" }} />
        )}
      </ConnectedContainer>

      <Divider style={{ margin: "40px 0 30px 0" }} />

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Code sample (Relayed / sponsored transaction)</Typography>
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

      <Box style={{ margin: "20px 0 20px 0" }} />

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Code sample (Covalent API)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CodeContainer>
            <CodeBlock
              text={code1}
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

export default WalletScreen;

const code = `import { GelatoRelayAdapter } from '@safe-global/relay-kit'

const relayAdapter = new GelatoRelayAdapter()

relayAdapter.relayTransaction({
  target: '0x...', // the Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: 5
})`;

const code1 = `
// refer to components/covalent/Tokens.tsx
const balancesEndpoint = 'https://api.covalenthq.com/v1/matic-mumbai/address/<walletAddress>/balances_v2/'

useEffect(() => {
  fetch(balancesEndpoint, {method: 'GET', headers: {
    "Authorization": '<btoa of apikey>'
  }})
    .then(res => res.json())
    .then(res => setData(res.data.items))
}, [balancesEndpoint])
`

const ConnectedContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;
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
