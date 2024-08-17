import React from 'react';
import TypingClient from './TypingClient';

class TypingEventSink {
  typingClients: TypingClient[];
  private setTypingClients: undefined | React.Dispatch<React.SetStateAction<TypingClient[]>>;

  constructor() {
    this.typingClients = [];
  }

  addTypingClient(input: { userTokenHash: string; userName: string }) {
    const removeCallback = (client: TypingClient) => {
      this.removeTypingClient(client);
      if (this.setTypingClients) this.setTypingClients([...this.typingClients]);
    };

    const existingTypingClient = this.typingClients.find((client) => client.userTokenHash === input.userTokenHash);

    if (existingTypingClient) {
      existingTypingClient.isTypingAgain();
    } else {
      const newTypingClient = new TypingClient(input, removeCallback);
      this.typingClients.push(newTypingClient);
      if (this.setTypingClients) this.setTypingClients([...this.typingClients]);
    }
  }

  removeTypingClient(client: TypingClient) {
    this.typingClients = this.typingClients.filter((c) => c.userTokenHash !== client.userTokenHash);
  }

  resetTypingClients() {
    this.typingClients = [];
    if (this.setTypingClients) this.setTypingClients([]);
  }

  setStateActionDispatcher(func: React.Dispatch<React.SetStateAction<TypingClient[]>>) {
    this.resetTypingClients();
    this.setTypingClients = func;
  }
}

export default TypingEventSink;
