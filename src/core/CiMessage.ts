import { z } from 'zod';
import { MessageBodyZSchema, SendMessageInputZSchema, SendMessageOutputZSchema } from '../../../types/trpc';
import { cipherioTRPCClient } from '../trpc/client';
import { generateRandomHexString } from '../utils/crypto';
import React from 'react';

export class CiMessagePreflight {
  public isSent: boolean;
  public isFailed: boolean;
  public messageBody: z.infer<typeof MessageBodyZSchema>;
  public chatRoomPassword: string;
  public chatRoomName: string;
  public key: string;
  public createdAt: string;

  private readonly setNewMsgList: React.Dispatch<React.SetStateAction<(CiMessagePreflight | CiMessagePostflight)[]>>;

  constructor(
    { chatRoomName, password, messageBody }: z.infer<typeof SendMessageInputZSchema>,
    setNewMsgList: React.Dispatch<React.SetStateAction<(CiMessagePreflight | CiMessagePostflight)[]>>,
  ) {
    this.isSent = false;
    this.isFailed = false;
    this.messageBody = messageBody;
    this.chatRoomPassword = password;
    this.chatRoomName = chatRoomName;
    this.setNewMsgList = setNewMsgList;

    const createdAt = new Date().toISOString();
    const salt = generateRandomHexString(12);
    this.key = `${createdAt}-S${salt}`;
    this.createdAt = createdAt;

    this.sendMessage({ chatRoomName, password, messageBody })
      .then(() => {
        this.isSent = true;
        this.setNewMsgList((p) => [...p]);
      })
      .catch(() => {
        this.isFailed = true;
        this.setNewMsgList((p) => [...p]);
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
    this.isSent = false;
    this.isFailed = false;
    this.setNewMsgList((p) => [...p]);

    cipherioTRPCClient.chat.sendMessage
      .mutate({
        chatRoomName: this.chatRoomName,
        password: this.chatRoomPassword,
        messageBody: this.messageBody,
      })
      .then(() => {
        this.isSent = true;
        this.setNewMsgList((p) => [...p]);
      })
      .catch(() => {
        this.isFailed = true;
        this.setNewMsgList((p) => [...p]);
      });
  }
}

export class CiMessagePostflight {
  public messageBody: z.infer<typeof MessageBodyZSchema>;
  public key: string;
  public createdAt: string;

  constructor({ messageBody }: { messageBody: z.infer<typeof MessageBodyZSchema> }) {
    const createdAt = new Date().toISOString();
    const salt = generateRandomHexString(12);
    this.key = `${createdAt}-S${salt}`;
    this.messageBody = messageBody;
    this.createdAt = createdAt;
  }
}
