import { useState } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import { utils } from "ethers";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAccountAbstraction } from "src/store/accountAbstractionContext";

import CovalentNfts from "src/components/covalent/Nfts";

type ScreenProps = {
  setScreen: (newStep: number) => void;
};

const NftsScreen = ({ setScreen }: ScreenProps) => {
  const {
    chainId,
    chain,

    safeSelected,
    safeBalance,

    isAuthenticated,
  } = useAccountAbstraction();

  const [transactionHash, setTransactionHash] = useState<string>("");

  if(!isAuthenticated) setScreen(0);

  return (
    <>
      <Typography variant="h2" component="h1">
        NFTs
      </Typography>

      <Typography marginTop="16px">
        NFTs are queried using Covalent API, which support numerous EVM networks.
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
      </Stack>

      <Divider sx={{ margin: "32px 0 28px 0" }} />

      {/* NFTs */}
      <ConnectedContainer
        display="flex"
        flexDirection="column"
        justifyContent="left"
        alignItems="left"
        gap={1}
      >
        <Typography fontWeight="700">NFTs of the embedded wallet (via Covalent)</Typography>

        <CovalentNfts wallet={safeSelected} chainId={chainId} />

      </ConnectedContainer>


      <Divider style={{ margin: "40px 0 30px 0" }} />

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

export default NftsScreen;

const code = `// refer to components/covalent/Tokens.tsx
const balancesEndpoint = 'https://api.covalenthq.com/v1/matic-mumbai/address/<walletAddress>/balances_v2/?nft=true'

useEffect(() => {
  fetch(balancesEndpoint, {method: 'GET', headers: {
    "Authorization": '<btoa of apikey>'
  }})
    .then(res => res.json())
    .then(res => setData(res.data.items))
}, [balancesEndpoint])`;

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
