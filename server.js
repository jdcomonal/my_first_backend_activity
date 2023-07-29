const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const port = 5000;

// Parse URL-encoded form data
app.use(express.urlencoded({ extended:true })) //

const Books = [
    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
]

const LoginProfiles = [

    {
        id: 1,
        username: "admin",
        password: "passwd123",
        isAdmin: true,
    },
    {
        id: 2,
        username: "staff",
        password: "123456",
        isAdmin: false,
    },
    {
        id: 3,
        username: "vice",
        password: "abrakadabra",
        isAdmin: false,
    },
{
        id: 4,
        username: "super",
        password: "69843",
        isAdmin: true,
    },
{
        id: 5,
        username: "user",
        password: "123",
        isAdmin: false,
    }
];


//middleware for security
const verify = (req, res, next)=>{

    const autHeader = req.headers.authorization;  
     console.log('check token here:  ' + req.headers.authorization);
  
      if(autHeader){
          const token = autHeader.split(" ")[1];
  
          jwt.verify(token, "ThisMYsecretKey", (err, user) => {

              if(err){
                    
                   return res.status(403).json("token is not valid")   
              }
              req.user = user;
              next();
          })

          
  
      } else {
          return res.status(403).json("You are not authenticated")   
      }   
  }

  const generateAccessToken = (user) => {
    return jwt.sign( { id: user.id, isAdmin: user.isAdmin }, "ThisMYsecretKey", {expiresIn : '1000s'})
}
 
// Make an endpoint to return all books in an array of JSON objects, please refer to
app.get('/books', verify,  (req, res)=>{
    res.json(Books); 
})

// Make an endpoint that will receive an Id of a book and return its details
app.post('/find_book',verify, (req, res)=>{
    
    let book_id =parseInt(req.body.book_id); // Accessing the value from the request body ; parseInt() = convert str to number

    const book = Books.find((u) => {
        
        console.log("Searching:", u.id,typeof(u.id),"===",typeof(book_id), book_id);

        return u.id === book_id;
      });
        
    console.log(book);

    if (book) {
 
        res.json(book);

    } else {
        res.status(400).json("BOOK NOT FOUND");
    }
});

// Create a login end point and implement the JWT security, use the LoginProfiles variable below.
app.post('/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    const user = LoginProfiles.find((u) => {
        return u.username === username && u.password === password;
    });

    if (user) {

        const accessToken = generateAccessToken(user);

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken,
        });

    } else {
        res.status(400).json("Username or Password incorrect");
    }

});







app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});