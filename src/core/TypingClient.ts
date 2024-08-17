type RemoveCallback = (client: TypingClient) => void;

class TypingClient {
  userTokenHash: string;
  userName: string;
  isTyping: boolean;
  eventExpiresAt: Date;
  interval: NodeJS.Timeout;
  removeCallback: RemoveCallback;

  constructor(input: { userTokenHash: string; userName: string }, removeCallback: RemoveCallback) {
    this.userTokenHash = input.userTokenHash;
    this.userName = input.userName;
    this.isTyping = true;
    this.eventExpiresAt = new Date(Date.now() + 3000 /* ms */);
    this.removeCallback = removeCallback;

    this.interval = setInterval(() => {
      if (this.eventExpiresAt <= new Date()) {
        this.isNotTyping();
      }
    }, 1000 /* ms */);
  }

  isTypingAgain() {
    this.eventExpiresAt = new Date(Date.now() + 3000 /* ms */);
  }

  isNotTyping() {
    this.isTyping = false;
    clearInterval(this.interval); // Clear the interval to avoid memory leaks
    this.removeCallback(this); // Use the callback to remove this instance
  }
}

export default TypingClient;
