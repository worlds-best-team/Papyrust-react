import TypingClient from './TypingClient';

class TypingEventSink {
  typingClients: TypingClient[];

  constructor() {
    this.typingClients = [];
  }

  addTypingClient(input: { userTokenHash: string; userName: string }) {
    const removeCallback = (client: TypingClient) => {
      this.removeTypingClient(client);
    };

    const existingTypingClient = this.typingClients.find((client) => client.userTokenHash === input.userTokenHash);

    if (existingTypingClient) {
      existingTypingClient.isTypingAgain();
    } else {
      const newTypingClient = new TypingClient(input, removeCallback);
      this.typingClients.push(newTypingClient);
    }
  }

  removeTypingClient(client: TypingClient) {
    this.typingClients = this.typingClients.filter((c) => c.userTokenHash !== client.userTokenHash);
  }
}

export default TypingEventSink;
