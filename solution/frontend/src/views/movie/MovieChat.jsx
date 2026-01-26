import Chat from "../../views/components/Chat";

export default function MovieChat({ movie }) {
  const room = `movie:${movie.id}`;
  const subtitle = `Chat with other fans about ${
    movie?.name ? `"${movie.name}"` : "this title"
  }`;
  const introText = movie?.name
    ? `Welcome to the chat dedicated to "${movie.name}". Share what you think!`
    : "Welcome to the movie chat. Share what you think!";

  return (
    <Chat
      room={room}
      title="Movie Chat"
      subtitle={subtitle}
      introText={introText}
      introAuthor="MovieBot"
      socketUrl="http://localhost:4000"
      storageKeyPrefix="filmChat:lastSentAt"
      usernamePlaceholder="Your name (min 3 characters)"
      messagePlaceholder="Write a thought or curiosity about the movie…"
      sendLabel="Send"
      emptyLabel="No messages yet. Start the conversation."
    />
  );
}