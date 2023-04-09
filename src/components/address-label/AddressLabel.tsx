import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton, Theme } from "@mui/material";
import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";
import OpenInNew from "@mui/icons-material/OpenInNew";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

import useMemoizedAddressLabel from "src/hooks/useMemoizedAddressLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";

type AddressLabelProps = {
  address: string;
  isTransactionAddress?: boolean;
  showBlockExplorerLink?: boolean;
  showCopyIntoClipboardButton?: boolean;
};

const AddressLabel = ({
  address,
  isTransactionAddress,
  showBlockExplorerLink,
  showCopyIntoClipboardButton = true,
}: AddressLabelProps) => {
  const { chain } = useAccountAbstraction();

  const addressLabel = useMemoizedAddressLabel(address);

  const blockExplorerLink = `${chain?.blockExplorerUrl}/${
    isTransactionAddress ? "tx" : "address"
  }/${address}`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      component="span"
    >
      <Tooltip title={address}>
        <span style={{ fontSize: "12px"}}>{addressLabel}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip
          title={`Copy this ${
            isTransactionAddress ? "transaction hash" : "address"
          } into your clipboard`}
        >
          <IconButton
            onClick={() => navigator?.clipboard?.writeText?.(address)}
            size={"small"}
          >
            <FileCopyOutlinedIcon sx={{ fontSize: "12px", color: "secondary.dark" }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Button to etherscan */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip title={"View details on block explorer"}>
          <IconButton
            component="a"
            href={blockExplorerLink}
            target="_blank"
            rel="noopener"
            size={"small"}
          >
            <OpenInNew sx={{ fontSize: "12px", color: "secondary.dark" }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default AddressLabel;
