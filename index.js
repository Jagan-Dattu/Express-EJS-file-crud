const express=require('express');
const path=require('path');
const fs=require('fs');

const app=express();
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.get('/',(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        console.log(files);
        res.render("index",{files:files});
    }) 
})
app.get('/file/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,filedata)=>{
        res.render("show",{filename:req.params.filename, filedata:filedata})
    })
})
app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.content,(err)=>{
        res.redirect('/')
    })
})
// Edit form
app.get('/edit/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, data) => {
    if (err) return res.send("Error loading file");
    res.render('edit', { filename: req.params.filename, content: data });
  });
});

// Handle edit form submission
app.post('/edit/:filename', (req, res) => {
  const oldName = req.params.filename;
  const newName = req.body.title.split(' ').join('') + '.txt';

  // Rename file if title changed
  fs.rename(`./files/${oldName}`, `./files/${newName}`, (err) => {
    if (err) return res.send("Rename failed");

    fs.writeFile(`./files/${newName}`, req.body.content, (err) => {
      if (err) return res.send("Write failed");
      res.redirect('/');
    });
  });
});

// Delete
app.post('/delete/:filename', (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    if (err) return res.send("Delete failed");
    res.redirect('/');
  });
});

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
