var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var template = require('./lib/template.js')
var path = require('path');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathName = url.parse(_url, true).pathname;

  if (pathName === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, files) => {
        var list = template.list(files);
        response.writeHead(200);
        response.end(template.html(list, `<h2>Welcome Page</h2>`, 
        `<a href="/create">CREATE</a>`));
      });
    } else {
      fs.readdir("./data", (err, files) => {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (err, filedata) {
          var list = template.list(files);
          response.writeHead(200);
          response.end(template.html(list, `<p>${filedata}</p>`,
          `<a href="/create">CREATE</a>
          <a href="/update?id=${queryData.id}">UPDATE</a>
          <form action="process_delete" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="delete">
          </form>
          `));
        });
      });
    }
  } else if (pathName === "/create") {
    fs.readdir("./data", (err, files) => {
      var list = template.list(files);
      response.writeHead(200);
      response.end(
        template.html(
          list,
          `
        <form action="/process_create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="content"></textarea></p>
          <p><input type="submit"></p>
        </form>
      ` ,  ''
        )
      );
    });
  } else if (pathName === "/process_create") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`./data/${title}`, description, "utf8", (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if(pathName === "/update"){
    fs.readdir("./data", (err, files) => {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (err, filedata)  {
        var title = queryData.id;
        var list = template.list(files);
        response.writeHead(200);
        response.end(template.html(list,
        `
        <form action="/process_update" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="description" placeholder="content">${filedata}</textarea></p>
          <p><input type="submit"></p>
        </form>
        `,
        `<a href="/create">CREATE</a>
        <a href="/update?id=${queryData.id}">UPDATE</a>`));
      });
    });
  } else if(pathName === "/process_update"){
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`,`data/${title}`,function(err){
          fs.writeFile(`data/${title}`,description,'utf8',function(err){
            response.writeHead(302, { Location: `/?id=${title}` });
            response.end();
          });
      });   
    });
  } else if(pathName ==="/process_delete"){
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.basename(id).base;
      fs.unlink(`data/${filteredId}`, function(err){
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
