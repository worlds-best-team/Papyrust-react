import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from '@trpc/client';
import type { AppRouter } from '../../../routers/app';

export const cipherioTRPCClient = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: createWSClient({
          url: 'wss://cipher-io-trpc.onrender.com/',
        }),
      }),
      false: httpBatchLink({
        url: 'https://cipher-io-trpc.onrender.com/trpc',
      }),
    }),
  ],
});
