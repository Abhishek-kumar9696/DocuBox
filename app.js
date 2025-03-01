// const express = require("express");
// const app = express();
// const fs = require("fs");

// app.set("view engine","ejs");

// app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/',(req,res) => {
//     fs.readdir(`./files`,function(err,files){

//             // res.send("files showed");
//             res.render("index",{files});

//     })
//     //res.render("index");
// })

// app.get('/create', (req,res) => {
//     try{
//         const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//     const year = today.getFullYear();

//         const fn = `${day}-${month}-${year}`;

//         const filePath = `./files/${fn}.txt`;

//         fs.writeFile(filePath,"Hello ji",function(err) {{
//             if(err){
//                 return res.send("Something went wrong");
//             }
//             else{
//                 res.send("done")
//             }
//         }})

//          console.log(fn);

//     } catch(err){
//         res.status(500).send({message:err});
//     }
// });
// app.get("/edit/:filename", (req,res) => {
//     fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
//         if (err) {
//             console.error(err);
//             return;
//           }
//         res.render("edit",{data});
//     })
// })

// app.listen(3000);


// const express = require("express");
// const app = express();
// const fs = require("fs");
// const path = require("path");

// app.set("view engine", "ejs");
// //sets EJS as the templating engine, enabling rendering of EJS views.

// app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Route to display the list of files
// app.get("/", (req, res) => {
//   fs.readdir("./files", (err, files) => {
//     if (err) {
//       return res.status(500).send("Error reading directory");
//     }
//     res.render("index", {files: files });
//   });
// });

// // Route to create a new file with the current date as the name
// app.get("/create", (req, res) => {
//   try {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//     const year = today.getFullYear();
//     const fn = `${day}-${month}-${year}.txt`; // Ensure the extension is included

//     const filePath = path.join(__dirname, "files", fn);

//     fs.writeFile(filePath, "Hello ji", (err) => {
//       if (err) {
//         return res.status(500).send("Something went wrong");
//       }
//       res.send("File created successfully");
//       // res.render("create",{data,filename:fn})
//     });

//     console.log(`File created: ${fn}`);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

// // Route to display the edit form with file content
// app.get("/edit/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "files", req.params.filename);

//   fs.readFile(filePath, "utf-8", (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Error reading file");
//     }
//     res.render("edit", { data, filename: req.params.filename });
//   });
// });


// // Route to delete the entry from 
// app.get("/delete/:filename", (req, res) => {
//     const filePath = path.join(__dirname, "files", req.params.filename);
  
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Error deleting file");
//       }
//       res.redirect("/");
//     });
//   });


// // Route to handle form submission for editing a file
// app.post("/update/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "files", req.params.filename);

//   fs.writeFile(filePath, req.body.filedata, "utf-8", (err) => {
//     if (err) {
//       return res.status(500).send("Error writing file");
//     }
//     res.redirect("/"); // Redirect to the file list after updating
//   });
// });

// app.post("/createhisaab",function (req,res){
//   fs.writeFile(`./files/${req.body.title}`,req.body.content , function (err){
//     if(err){
//       return res.status(500).end(err);
//     }
//     res.redirecct("/");
//   });
// })

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });



const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to display the list of files
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }
    res.render("index", { files: files });
  });
});

// Route to create a new file, either with the current date or a custom name
app.get("/create", (req, res) => {
  res.render("create", { errorMessage: null });
});

// Handle file creation
app.post("/create", (req, res) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  let filename = req.body.filename || `${day}-${month}-${year}.txt`;

  if (!filename.endsWith(".txt")) {
      filename += ".txt";
  }

  const filePath = path.join(__dirname, "files", filename);

  console.log(`Checking file path: ${filePath}`); // Debugging statement

  // Check if the file already exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
      if (!err) {
          // File exists, render the create page with an error message
          console.log("File already exists"); // Debugging statement
          return res.render("create", { errorMessage: "File already exists. Please choose a different name." });
      }

      // If the file doesn't exist, create it
      fs.writeFile(filePath, '', (err) => {
          if (err) {
              console.error("Error creating file:", err);
              return res.render("create", { errorMessage: "An error occurred while creating the file." });
          }

          // Redirect or render a success page
          res.redirect('/');
      });
  });
});

// Route to edit file content
app.get("/edit/:filename", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file");
    }
    res.render("edit", { data, filename: req.params.filename });
  });
});

// Route to delete a file
app.get("/delete/:filename", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting file");
    }
    res.redirect("/");
  });
});

// Route to handle form submission for editing a file
app.post("/update/:filename", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.writeFile(filePath, req.body.filedata, "utf-8", (err) => {
    if (err) {
      return res.status(500).send("Error writing file");
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
