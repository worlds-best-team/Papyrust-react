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
          url: 'ws://localhost:3000',
        }),
      }),
      false: httpBatchLink({
        url: 'http://localhost:3000/trpc',
      }),
    }),
  ],
});
