module.exports  = {
    html: function(list, data,update){
      return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
        </head>
        <body>
            <h1>Hyojung! Enjoy Nodejs Study!</h1>
            ${list}
            ${update}
            ${data}
        </body>
        </html>`;
      },
      list: function(files){
        var list = "<ul>";
        var i = 0;
        while (i < files.length) {
          list = list + `<li><a href= "/?id=${files[i]}">${files[i]}</a></li>`;
          i++;
        }
        list = list + "</ul>";
        return list;
      }
  }
