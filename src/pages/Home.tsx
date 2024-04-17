import ChatRoomsSection from "../components/Chat-room";
import ChatSection from "../components/Chats";
import MembersStatusSection from "../components/Members-status";

function HomePage() {
    return (
        <div className="bg-gray-800 w-full h-full flex flex-col">
            <div className="text-white">navbar</div>
            <div className="bg-gray-700 w-full grid grid-cols-3 gap-2 text-white flex-grow">
                <ChatRoomsSection />
                <ChatSection />
                <MembersStatusSection />
            </div>
        </div>
    );
}

export default HomePage;
