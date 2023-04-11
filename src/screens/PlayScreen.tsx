// @ts-nocheck
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import { CodeBlock, atomOneDark } from "react-code-blocks";

import { useAccountAbstraction } from "src/store/accountAbstractionContext";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useState, useEffect } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";

const PlayScreen = () => {
  const { 
    loginWeb3Auth, isAuthenticated, safeSelected, safeBalance, chainId, chain,
    
    isRelayerLoading, relayTransaction, gelatoTaskId,
    getPopCornCounter, incrementPopCornCounter,
  
  } = useAccountAbstraction();

  const [transactionHash, setTransactionHash] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");

  const [gameButtonsDisabled, setGameButtonsDisabled] = useState<Boolean>(false);
  
  const [popCounter, setPopCounter] = useState<string>("-");
  const [cornCounter, setCornCounter] = useState<string>("-");

  const getCounter = async () => {
    const popcorn = await getPopCornCounter();
    
    if(popcorn) {
      console.log("popcorn: ", popcorn);
      setPopCounter(popcorn[0].toString());
      setCornCounter(popcorn[1].toString());
    }
  }

  const onClickGameButtons = async (popOrCorn: string) => {
    setGameButtonsDisabled(true)

    incrementPopCornCounter(popOrCorn)
  }

  // update pop corn counters
  useEffect(() => {
    getCounter()
      .catch(console.error);
  }, [isAuthenticated]);

  useEffect(() => {
    console.log("tx hash: ", transactionHash)
  }, [transactionHash])

  useEffect(() => {
    console.log("tx status: ", transactionStatus)
    if(transactionStatus === "ExecSuccess") {
      getCounter()
        .catch(console.error);

      setGameButtonsDisabled(false)
    }
  }, [transactionStatus])

  return (
    <>
      <Typography variant="h2" component="h1">
        web3 games with web2 UX
      </Typography>

      <Typography marginTop="16px">
        Users login with their existing Web2 accounts (Email, Facebook, Discord, etc).
        <br />
        No more wallet. No more passphrase. No more annoying clicks for transaction approvals.
      </Typography>

      <Typography marginTop="16px">
        <em>Embedded wallet</em> is a smart contract wallet controlled by an EOA wallet linked to user's social account. Transactions are gasless through Gelato's relayer sponsored by games.
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Powered by:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://safe.global/"
          target="_blank"
        >
          Safe
        </Link>

        <Link
          href="https://web3auth.io/"
          target="_blank"
        >
          Web3Auth
        </Link>

        <Link
          href="https://www.gelato.network/"
          target="_blank"
        >
          Gelato
        </Link>

        <Link
          href="https://ramp.network/"
          target="_blank"
        >
          Ramp
        </Link>

        <Link
          href="https://www.covalenthq.com/"
          target="_blank"
        >
          Covalent
        </Link>
      </Stack>

      <Divider style={{ margin: "32px 0 28px 0" }} />

      {/* Play Screen */}
      {isAuthenticated ? (
        <Box display="flex" gap={1}>
          {/* owner ID */}
          <ConnectedContainer width="100%">
            <Typography fontWeight="700">Interact with game smart contract</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="16px">
              wallet is abstracted away from user to provide frictionless, gasless UX
            </Typography>
            <Typography fontSize="14px" marginTop="8px" marginBottom="16px">
              game contract address is: <a href="https://mumbai.polygonscan.com/address/0xe6d466de66fbc2044f1fa320b67fac3c3c8df3e7#code" target="_blank">0xe6D466De66FBc2044f1FA320B67fAc3C3c8DF3e7</a>
            </Typography>

            {/* Simple PopCorn contract: 
              https://mumbai.polygonscan.com/address/0xe6D466De66FBc2044f1FA320B67fAc3C3c8DF3e7
            */}
            <Grid container spacing={1}>
              <Grid item xs={5} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{marginBottom: '8px', fontSize: '24px', fontWeight: '800'}}>
                  {popCounter}
                </Box>
                <Button variant="outlined" sx={{width: '80%'}} disabled={gameButtonsDisabled} onClick={() => onClickGameButtons("pop")}>🍭<br />POP</Button>
              </Grid>
              <Grid item xs={2} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box>
                  Vs
                </Box>
              </Grid>
              <Grid item xs={5} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{marginBottom: '8px', fontSize: '24px', fontWeight: '800'}}>
                  {cornCounter}
                </Box>
                <Button variant="outlined" sx={{width: '80%'}} disabled={gameButtonsDisabled} onClick={() => onClickGameButtons("corn")}>🌽<br/>CORN</Button>
              </Grid>
            </Grid>

            {gelatoTaskId && (
              <GelatoTaskStatusLabel
                gelatoTaskId={gelatoTaskId}
                chainId={chainId}
                setTransactionHash={setTransactionHash}
                transactionHash={transactionHash}
                setTransactionStatus={setTransactionStatus}
                sx={{margin: "8px"}}
              />
            )}

            {isRelayerLoading && (
              <LinearProgress sx={{ alignSelf: "stretch", margin: "8px" }} />
            )}

          </ConnectedContainer>
        </Box>
      ) : (
        <ConnectContainer
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          <Typography marginTop="16px" marginBottom="16px">
            Login with email or social accounts.
          </Typography>
          <Button variant="contained" onClick={loginWeb3Auth}>
            Login
          </Button>
        </ConnectContainer>
      )}

      <Divider style={{ margin: "40px 0 30px 0" }} />

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Code sample (Auth)</Typography>
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
          <Typography>Code sample (Contract interaction)</Typography>
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

export default PlayScreen;

const code = `import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'

const safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
  chainId: '0x5',
  authProviderConfig: {
    rpc: <Your rpc url>, // Add your RPC e.g. https://goerli.infura.io/v3/<your project id>
    clientId: <Your client id>, // Add your client id. Get it from the Web3Auth dashboard
    network: 'testnet' | 'mainnet', // The network to use for the Web3Auth modal.
    theme: 'light' | 'dark' // The theme to use for the Web3Auth modal
  }
})

// Allow to login and get the derived eoa
safeAuthKit.signIn()

// Logout
safeAuthKit.signOut()

// Get the provider
safeAuthKit.getProvider()

`;

const ConnectContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 50px;
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

const ConnectedContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;
`
);
