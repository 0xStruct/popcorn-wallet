import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { utils, ethers, BigNumber } from "ethers";
import { SafeAuthKit, SafeAuthProviderType } from "@safe-global/auth-kit";
import AccountAbstraction, {
  MetaTransactionData as MetaTransactionDataX,
  MetaTransactionOptions as MetaTransactionOptionsX,
} from "@safe-global/account-abstraction-kit-poc";
import { GelatoRelayAdapter, MetaTransactionOptions } from "@safe-global/relay-kit";
import {
  SafeOnRampKit,
  SafeOnRampEvent,
  SafeOnRampProviderType,
} from "@safe-global/onramp-kit";

import getChain from "src/utils/getChain";
import Chain from "src/models/chain";
import { initialChain } from "src/chains/chains";
import usePolling from "src/hooks/usePolling";

import EthersAdapter from "@safe-global/safe-ethers-lib";
import Safe from "@safe-global/safe-core-sdk";
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'

type accountAbstractionContextValue = {
  ownerAddress?: string;
  chainId: string;
  safes: string[];
  chain?: Chain;
  isAuthenticated: boolean;
  web3Provider?: ethers.providers.Web3Provider;
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;
  setChainId: (chainId: string) => void;
  safeSelected?: string;
  safeBalance?: string;
  setSafeSelected: React.Dispatch<React.SetStateAction<string>>;
  isRelayerLoading: boolean;
  relayTransaction: () => Promise<void>;
  getPopCornCounter: () => Promise<void>;
  incrementPopCornCounter: (popOrCorn: string) => Promise<void>;
  gelatoTaskId?: string;
  openStripeWidget: () => Promise<void>;
  closeStripeWidget: () => Promise<void>;
};

const initialState = {
  isAuthenticated: false,
  loginWeb3Auth: () => {},
  logoutWeb3Auth: () => {},
  relayTransaction: async () => {},
  getPopCornCounter: async () => {},
  incrementPopCornCounter: async () => {},
  setChainId: () => {},
  setSafeSelected: () => {},
  onRampWithStripe: async () => {},
  safes: [],
  chainId: initialChain.id,
  isRelayerLoading: true,
  openStripeWidget: async () => {},
  closeStripeWidget: async () => {},
};

const accountAbstractionContext =
  createContext<accountAbstractionContextValue>(initialState);

const useAccountAbstraction = () => {
  const context = useContext(accountAbstractionContext);

  if (!context) {
    throw new Error(
      "useAccountAbstraction should be used within a AccountAbstraction Provider"
    );
  }

  return context;
};

const AccountAbstractionProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>("");

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([]);

  // chain selected
  const [chainId, setChainId] = useState<string>(initialChain.id);

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const isAuthenticated = !!ownerAddress && !!chainId;
  const chain = getChain(chainId) || initialChain;

  // reset React state when you switch the chain
  useEffect(() => {
    setOwnerAddress("");
    setSafes([]);
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
    setAuthClient(undefined);
  }, [chain]);

  // authClient
  const [authClient, setAuthClient] = useState<SafeAuthKit>();

  // onRampClient
  const [onRampClient, setOnRampClient] = useState<SafeOnRampKit>();

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    try {
      const safeAuth = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
        chainId: chain.id,
        txServiceUrl: chain.transactionServiceUrl,
        authProviderConfig: {
          rpcTarget: chain.rpcUrl,
          clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || "",
          network: "testnet",
          theme: "dark",
        },
      });

      if (safeAuth) {
        const { safes, eoa } = await safeAuth.signIn();
        const provider =
          safeAuth.getProvider() as ethers.providers.ExternalProvider;

        // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
        setChainId(chain.id);
        setOwnerAddress(eoa);
        setSafes(safes || []);
        setWeb3Provider(new ethers.providers.Web3Provider(provider));
        setAuthClient(safeAuth);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [chain]);

  const logoutWeb3Auth = () => {
    authClient?.signOut();
    setOwnerAddress("");
    setSafes([]);
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
    setAuthClient(undefined);
  };

  // TODO: add disconnect owner wallet logic ?

  // current safe selected by the user
  const [safeSelected, setSafeSelected] = useState<string>("");

  // conterfactual safe Address if its not deployed yet
  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner();
        const relayAdapter = new GelatoRelayAdapter();
        const safeAccountAbstraction = new AccountAbstraction(signer);

        await safeAccountAbstraction.init({ relayAdapter });

        const hasSafes = safes.length > 0;

        const safeSelected = hasSafes
          ? safes[0]
          : safeAccountAbstraction.getSafeAddress();

        setSafeSelected(safeSelected);
      }
    };

    getSafeAddress();
  }, [safes, web3Provider]);

  const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false);
  const [gelatoTaskId, setGelatoTaskId] = useState<string>();

  // refresh the Gelato task id
  useEffect(() => {
    setIsRelayerLoading(false);
    setGelatoTaskId(undefined);
  }, [chainId]);

  // relay-kit implementation using Gelato
  const relayTransaction = async () => {
    if (web3Provider) {
      setIsRelayerLoading(true);
      setGelatoTaskId(undefined);

      const signer = web3Provider.getSigner();
      const relayAdapter = new GelatoRelayAdapter(process.env.REACT_APP_GELATO_RELAYER_KEY);
      const safeAccountAbstraction = new AccountAbstraction(signer);

      await safeAccountAbstraction.init({ relayAdapter });

      // we use a dump safe transfer as a demo transaction
      const dumpSafeTransfer: MetaTransactionDataX = {
        to: safeSelected,
        data: "0x",
        value: BigNumber.from(utils.parseUnits("0.001", "ether").toString()),
        operation: 0, // OperationType.Call,
      };

      const options: MetaTransactionOptionsX = {
        isSponsored: false,
        gasLimit: BigNumber.from("1000000"), // in this alfa version we need to manually set the gas limit :<
        gasToken: ethers.constants.AddressZero, // native token ???
      };

      console.log("deployed: ", await safeAccountAbstraction.isSafeDeployed())
      console.log("signer addr: ", await safeAccountAbstraction.getSignerAddress())
      console.log("safe addr: ", await safeAccountAbstraction.getSafeAddress())

      const gelatoTaskId = await safeAccountAbstraction.relayTransaction(
        dumpSafeTransfer,
        options
      );

      setIsRelayerLoading(false);
      setGelatoTaskId(gelatoTaskId);
    }
  };

  // PopCornCounter
  // https://mumbai.polygonscan.com/address/0xe6D466De66FBc2044f1FA320B67fAc3C3c8DF3e7
  const getPopCornCounter = async () => {
    console.log('getPopCornCounter')
    if (web3Provider) {    
      const signer = web3Provider.getSigner();

      const contractABI =
        '[{"inputs":[],"name":"getPopCorn","outputs":[{"internalType":"int128","name":"","type":"int128"},{"internalType":"int128","name":"","type":"int128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"incrementCorn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"incrementPop","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
      const contractAddress = "0xe6D466De66FBc2044f1FA320B67fAc3C3c8DF3e7";

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      return await contract.getPopCorn();
    }
  };

  const incrementPopCornCounter = async (popOrCorn: string) => {
    if (web3Provider) {    
      setIsRelayerLoading(true);
      setGelatoTaskId(undefined);

      const signer = web3Provider.getSigner(); 
      const relayAdapter = new GelatoRelayAdapter(process.env.REACT_APP_GELATO_RELAYER_KEY);
      //const safeAccountAbstraction = new AccountAbstraction(signer);
      //await safeAccountAbstraction.init({ relayAdapter });

      const contractABI =
        '[{"inputs":[],"name":"getPopCorn","outputs":[{"internalType":"int128","name":"","type":"int128"},{"internalType":"int128","name":"","type":"int128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"incrementCorn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"incrementPop","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
      const contractAddress = "0xe6D466De66FBc2044f1FA320B67fAc3C3c8DF3e7";
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // const contractInterface = new ethers.utils.Interface(contractABI);
      // txData = contractInterface.encodeFunctionData("incrementPop");
      // console.log("txData: ", txData)

      const unsignedTx = await contract.populateTransaction.incrementPop();
      console.log("unsignedTx: ", unsignedTx)

      let txData = "0x177eca08";
      if(popOrCorn === "pop") {
        txData = "0x177eca08"
      } else if(popOrCorn === "corn") {
        txData = "0x330eba29"
      }

      const safeTransactionData: MetaTransactionData = {
        to: contractAddress,
        data: txData,
        value: utils.parseUnits("0", "ether").toString(), //BigNumber.from(utils.parseUnits("0", "ether").toString()),
        operation: 0, // OperationType.Call,
      };

      const options: MetaTransactionOptions = {
        isSponsored: true,
        gasLimit: BigNumber.from("1000000"), // in this alfa version we need to manually set the gas limit :<
        gasToken: ethers.constants.AddressZero, // native token ???
      };

      
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
      })
        
      const safeSDK = await Safe.create({
          ethAdapter,
          safeAddress: safeSelected
      })

      // Prepare the transaction
      const safeTransaction = await safeSDK.createTransaction({
        safeTransactionData: safeTransactionData
      })
      
      const signedSafeTx = await safeSDK.signTransaction(safeTransaction)

      console.log("signedSafeTx.data: ", signedSafeTx.data)
      
      const encodedTx = safeSDK.getContractManager().safeContract.encode('execTransaction', [
        signedSafeTx.data.to,
        signedSafeTx.data.value,
        signedSafeTx.data.data,
        signedSafeTx.data.operation,
        signedSafeTx.data.safeTxGas,
        signedSafeTx.data.baseGas,
        signedSafeTx.data.gasPrice,
        signedSafeTx.data.gasToken,
        signedSafeTx.data.refundReceiver,
        signedSafeTx.encodedSignatures()
      ])
      console.log("encodedTx: ", encodedTx)

      const relayTransaction: any = {
        target: contractAddress,
        encodedTransaction: encodedTx.replace("0x6a761202", txData),
        chainId: 80001,
        options
      }
      const response = await relayAdapter.relayTransaction(relayTransaction)

      console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)

      setIsRelayerLoading(false);
      setGelatoTaskId(response.taskId);
    }
  };

  // onramp-kit implementation
  const openStripeWidget = async () => {
    const onRampClient = await SafeOnRampKit.init(
      SafeOnRampProviderType.Stripe,
      {
        onRampProviderConfig: {
          stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || "",
          onRampBackendUrl: process.env.REACT_APP_STRIPE_BACKEND_BASE_URL || "",
        },
      }
    );
    const sessionData = await onRampClient?.open({
      // sessionId: sessionId, optional parameter
      walletAddress: safeSelected,
      networks: ["ethereum", "polygon"],
      element: "#stripe-root",
      events: {
        onLoaded: () => console.log("onLoaded()"),
        onPaymentSuccessful: (eventData: SafeOnRampEvent) =>
          console.log("onPaymentSuccessful(): ", eventData),
        onPaymentProcessing: (eventData: SafeOnRampEvent) =>
          console.log("onPaymentProcessing(): ", eventData),
        onPaymentError: (eventData: SafeOnRampEvent) =>
          console.log("onPaymentError(): ", eventData),
      },
    });

    setOnRampClient(onRampClient);

    console.log("Stripe sessionData: ", sessionData);
  };

  const closeStripeWidget = async () => {
    onRampClient?.close();
  };

  // we can pay Gelato tx relayer fees with native token & USDC
  // TODO: ADD native Safe Balance polling
  // TODO: ADD USDC Safe Balance polling

  // fetch safe address balance with polling
  const fetchSafeBalance = useCallback(async () => {
    const balance = await web3Provider?.getBalance(safeSelected);

    return balance?.toString();
  }, [web3Provider, safeSelected]);

  const safeBalance = usePolling(fetchSafeBalance);

  const state = {
    ownerAddress,
    chainId,
    chain,
    safes,

    isAuthenticated,

    web3Provider,

    loginWeb3Auth,
    logoutWeb3Auth,

    setChainId,

    safeSelected,
    safeBalance,
    setSafeSelected,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,

    getPopCornCounter,
    incrementPopCornCounter,

    openStripeWidget,
    closeStripeWidget,
  };

  return (
    <accountAbstractionContext.Provider value={state}>
      {children}
    </accountAbstractionContext.Provider>
  );
};

export { useAccountAbstraction, AccountAbstractionProvider };
