import { z } from 'zod';
import { MessageBodyZSchema, SendMessageInputZSchema, SendMessageOutputZSchema } from '../../../types/trpc';
import { cipherioTRPCClient } from '../../trpc/client';

export class CiMessagePreflight {
  public isSent: boolean;
  public isFailed: boolean;
  public messageBody: z.infer<typeof MessageBodyZSchema>;
  public chatRoomPassword: string;
  public chatRoomName: string;

  constructor({ chatRoomName, password, messageBody }: z.infer<typeof SendMessageInputZSchema>) {
    this.isSent = false;
    this.isFailed = false;
    this.messageBody = messageBody;
    this.chatRoomPassword = password;
    this.chatRoomName = chatRoomName;

    this.sendMessage({ chatRoomName, password, messageBody })
      .then((sendMessageOutput) => {
        this.isSent = sendMessageOutput.success;
      })
      .catch(() => {
        this.isFailed = true;
      });
  }

  private async sendMessage({
    chatRoomName,
    password,
    messageBody,
  }: z.infer<typeof SendMessageInputZSchema>): Promise<z.infer<typeof SendMessageOutputZSchema>> {
    return cipherioTRPCClient.chat.sendMessage.mutate({
      chatRoomName,
      password,
      messageBody,
    });
  }

  public async retry() {
    return cipherioTRPCClient.chat.sendMessage.mutate({
      chatRoomName: this.chatRoomName,
      password: this.chatRoomPassword,
      messageBody: this.messageBody,
    });
  }
}

export class CiMessagePostflight {
  public messageBody: z.infer<typeof MessageBodyZSchema>;
  public key: string;
  public createdAt: string;

  constructor({
    messageBody,
    key,
    createdAt,
  }: {
    messageBody: z.infer<typeof MessageBodyZSchema>;
    key: string;
    createdAt: string;
  }) {
    this.messageBody = messageBody;
    this.key = key;
    this.createdAt = createdAt;
  }
}
