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

function CovalentNfts({wallet, chainId}: Props) {
  const [data, setData] = useState([])

  //const walletAddress = '0x0b17cf48420400e1D71F8231d4a8e43B3566BB5B'
  const walletAddress = '0xF75a0001F014204CecD8c84A838495352c06178B'
  const balancesEndpoint = `https://api.covalenthq.com/v1/matic-mainnet/address/${walletAddress}/balances_v2/?nft=true`

  const apiKey = process.env.REACT_APP_COVALENT_API_KEY;

  useEffect(() => {
    fetch(balancesEndpoint, {
      method: 'GET', headers: {
        "Authorization": `Basic ${btoa(apiKey + ':')}`
      }
    })
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
      {data.map((item, i) => {
        if(item.type !== "nft") return null

        return (
          <ListItem key={i} >
            <ListItemAvatar>
              <Avatar sx={{backgroundColor: 'background.paper', color: '#333'}} src={item.nft_data[0].external_data.image_256}>-</Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={item.contract_name ? item.contract_name : item.nft_data[0].external_data.name} 
              secondary={(
                <Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    #{item.nft_data[0].token_id.substring(0, 12)}...
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', position: 'absolute', right: '14px'}}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    <a href={item.nft_data[0].token_url} target="_blank" rel="noreferrer">🔗</a>
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

export default CovalentNfts;
