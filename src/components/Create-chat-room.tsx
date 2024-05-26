function CreateChatRoom() {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
        <div className="bg-neutral-900 p-5">
            <h2 className="text-yellow-400">[ Create your chat room ]</h2>
            <form className="flex flex-col items-left gap-2 pt-5">
              <div className="py-5">
              <label className="text-gray-400">Enter a username</label>
              <input type="text" name="name"/>
              </div>
             <div> 
              <label className="text-gray-400">Chat room needs a name too..</label>
              <input type="text" name="name"/>
              </div>
            </form>
        </div>
    </div>
  )
}

export default CreateChatRoom