using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Web.Controllers
{
    public class Person
    {
        private static int _id = 0;

        public Person()
        {
            Id = _id;
            _id++;
        }

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private static List<Person> _people = new();

        private IHubContext<TestHub> _hub;

        public PeopleController(IHubContext<TestHub> hub)
        {
            _hub = hub;
        }

        [Route("getall")]
        [HttpGet]
        public List<Person> GetAll()
        {
            return _people;
        }

        [Route("add")]
        [HttpPost]
        public void Add(Person p)
        {
            _people.Add(p);
            _hub.Clients.All.SendAsync("newPerson", p);
        }

    }
}
