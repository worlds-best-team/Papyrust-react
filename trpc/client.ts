import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../routers/app';

export const cipherioTRPCClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function meow() {
  console.log(await cipherioTRPCClient.helloStuti.query());
}

meow();
