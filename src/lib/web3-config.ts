import { http, createConfig, createConnector } from 'wagmi'
import { type Chain } from 'viem'

// Polygon Mainnet
export const polygonMainnet = {
  id: 137,
  name: 'Polygon Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
  },
  testnet: false,
} as const satisfies Chain

// Polygon Amoy Testnet (replaces Mumbai)
export const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/amoy' },
  },
  testnet: true,
} as const satisfies Chain

// Polygon zkEVM Cardona Testnet
export const polygonZkEvmCardona = {
  id: 2442,
  name: 'Polygon zkEVM Cardona Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.cardona.zkevm-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://cardona-zkevm.polygonscan.com' },
  },
  testnet: true,
} as const satisfies Chain

// Custom injected connector that properly implements getChainId
function customInjected() {
  return createConnector((config) => ({
    id: 'injected',
    name: 'Injected',
    type: 'injected' as const,

    async setup() {},

    async getProvider() {
      if (typeof window === 'undefined') return undefined;
      return window.ethereum;
    },

    async connect({ chainId } = {}) {
      const provider = window.ethereum;
      if (!provider) throw new Error('No injected provider found');

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      let currentChainId = await provider.request({ method: 'eth_chainId' });
      currentChainId = Number(currentChainId);

      if (chainId && currentChainId !== chainId) {
        await this.switchChain?.({ chainId });
        currentChainId = chainId;
      }

      return {
        accounts: [account],
        chainId: currentChainId,
      };
    },

    async disconnect() {
      // Injected providers don't have a disconnect method
    },

    async getAccounts() {
      const provider = window.ethereum;
      if (!provider) return [];
      const accounts = await provider.request({ method: 'eth_accounts' });
      return accounts;
    },

    async getChainId() {
      const provider = window.ethereum;
      if (!provider) throw new Error('No injected provider found');
      const chainId = await provider.request({ method: 'eth_chainId' });
      return Number(chainId);
    },

    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return accounts.length > 0;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }) {
      const provider = window.ethereum;
      if (!provider) throw new Error('No injected provider found');

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return config.chains.find(c => c.id === chainId) || config.chains[0];
      } catch (error: any) {
        // Chain not added, try to add it
        if (error.code === 4902) {
          const chain = config.chains.find(c => c.id === chainId);
          if (!chain) throw new Error('Chain not configured');

          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls.default.http as any,
              blockExplorerUrls: chain.blockExplorers?.default ? [chain.blockExplorers.default.url] : undefined,
            }],
          });

          return chain;
        }
        throw error;
      }
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.onDisconnect?.();
      } else {
        config.emitter.emit('change', { accounts: accounts as readonly `0x${string}`[] });
      }
    },

    onChainChanged(chainId) {
      const id = Number(chainId);
      config.emitter.emit('change', { chainId: id });
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}

// Using Polygon Testnets with reliable RPC endpoints
export const config = createConfig({
  chains: [polygonMainnet, polygonAmoy, polygonZkEvmCardona],
  connectors: [customInjected()],
  transports: {
    [polygonMainnet.id]: http('https://polygon-rpc.com'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [polygonZkEvmCardona.id]: http('https://rpc.cardona.zkevm-rpc.com'),
  },
})