function JoinChatRoom() {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
    <div className="bg-neutral-900 p-5">
        <h2 className="text-yellow-400">[ Join an existing chat room ]</h2>
        <form className="flex flex-col items-left gap-2 pt-5 w-[70%]">
          <div className="py-5">
          <label className="text-gray-400">Enter a username</label>
          <input type="text" name="name"/>
          </div>
         <div className=""> 
          <label className="text-gray-400 ">Name of the chat room</label>
          <input type="text" name="name"/>
          </div>
          <div className="py-5 flex flex-col"> 
          <label className="text-gray-400">Password here</label>
          <input type="text" name="name"/>
          </div>
        </form>
    </div>
</div>
  )
}

export default JoinChatRoom