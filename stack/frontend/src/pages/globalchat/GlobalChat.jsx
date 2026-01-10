import DefaultPage from "../../components/DefaultPage";
import Chat from "../../components/Chat";

export default function GlobalChat() {
    return (
        <DefaultPage>
        <div className="film-page">
                <Chat
                    room="global"
                    title="Global Chat"
                    subtitle="Talk about movies with fellow cinephiles from around the world!"
                    introText="Welcome to the Global Chat! Share your thoughts on movies, ask for recommendations, and connect with other movie enthusiasts."
                    introAuthor="MovieBot"
                    socketUrl="http://localhost:4000"
                    storageKeyPrefix="globalChat:lastSentAt"
                    usernamePlaceholder="Your name (min 3 characters)"
                    messagePlaceholder="Type a message…"
                    sendLabel="Send"
                    emptyLabel="No messages yet. Start the conversation!"
                />
            </div>
        </DefaultPage>
    );
}
