// @ts-nocheck
import Typography from "@mui/material/Typography";

import { useState, useEffect, Fragment } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

type Props = {
  wallet: string | undefined,
  chainId: string
};

function CovalentTokens({wallet, chainId}: Props) {
  const [data, setData] = useState([])

  //const walletAddress = '0x0b17cf48420400e1D71F8231d4a8e43B3566BB5B'
  const walletAddress = '0xF75a0001F014204CecD8c84A838495352c06178B'
  const balancesEndpoint = `https://api.covalenthq.com/v1/matic-mumbai/address/${walletAddress}/balances_v2/`

  const apiKey = process.env.REACT_APP_COVALENT_API_KEY;
  
  useEffect(() => {
    fetch(balancesEndpoint, {method: 'GET', headers: {
      "Authorization": `Basic ${btoa(apiKey + ':')}`
    }})
      .then(res => res.json())
      .then(res => setData(res.data.items))
  }, [balancesEndpoint])

  return (
    <>
      <Typography sx={{ fontSize: '12px'}}>
        Embedded wallet: {wallet}
        <br />
        Chain: {chainId}
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }} dense="true">
      {data.map(item => {
        if(!item.contract_name) return null

        return (
          <ListItem key={item.contract_name} >
            <ListItemAvatar>
              <Avatar sx={{backgroundColor: 'background.paper', color: '#333'}} src={item.logo_url}>-</Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={item.contract_name} 
              secondary={(
                <Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {(item.balance/(10**item.contract_decimals)).toFixed(4)}
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', position: 'absolute', right: '14px', fontSize: '20px' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    ${item.quote.toFixed(2)}
                  </Typography>
                </Fragment>
                
              )} 
            />
          </ListItem>
        )
      })}
      </List>
    </>
  );
}

export default CovalentTokens;
