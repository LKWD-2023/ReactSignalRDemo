using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Web
{
    public class ChatMessage
    {
        public string Message { get; set; }
    }

    public class TestHub : Hub  
    {
        //public TestHub(IConfiguration configuration)
        //{
        //    configuration.GetConnectionString("ConStr");
        //}

        private static List<ChatMessage> _messages = new();

        public void Foobar()
        {
            Clients.All.SendAsync("newMessage", new { value = Guid.NewGuid() });
        }

        public void NewChatMessage(ChatMessage chatMessage)
        {
            _messages.Add(chatMessage);
            Clients.All.SendAsync("newChatReceived", chatMessage);
        }

        public void NewUser()
        {
            //var userEmail = Context.User.Identity.Name; - get currently logged in user

            Clients.Caller.SendAsync("allMessages", _messages);
        }
    }
}
