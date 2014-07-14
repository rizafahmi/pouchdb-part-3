## Introduction

In the last [article](http://elixirdose.com/post/6xAJwZpPnJXsYHCz7), we finished our journal app by only using vanilla JavaScript. In this article, we introduce to you [RactiveJS](http://www.ractivejs.org/) for its next-generation DOM manipulation. I have a strong feeling that RactiveJS will become a perfect match for PouchDB. With RactiveJS joining the party, we can achieve some kind of data-driven, real-time app without too much adding and removing DOM using JavaScript like we did in the `redrawUI` function.

But before we do that, let's upgrade our web framework, [Phoenix](https://github.com/phoenixframework/phoenix). A couple days ago, Phoenix released a new version that provides us with a more elegant way to use views.

## Migrating to the New Phoenix

For some reason, I cannot upgrade Phoenix from my current project. So let's create a new project using Phoenix v0.3.1. Then we can migrate from the old project to the new one.

### Installing Phoenix

The installation process is still the same. What makes the difference is just the version tag:

    $> git clone https://github.com/phoenixframework/phoenix.git && cd phoenix && git checkout v0.3.0 && mix do deps.get, compile

That's it. Now we can create our new project using the Phoenix v0.3.0.


### Create New Phoenix Application

With the new version of phoenix installed, we just have to create a new application using the commands below:

    $> mix phoenix.new pouch_journal_3 ../pouch_journal_3
    $> cd ../pouch_journal_3
    $> mix do deps.get, compile
    $> mix phoenix.start

That's pretty much it. Now open your browser and enter [http://localhost:4000](http://localhost:4000) in the url bar, and you'll see something beautiful :)

![screenshot](http://www.picamatic.com/show/2014/07/14/01/29/10589176_848x660.png)


### Migrating The HTML File

From the old project HTML file, we copy some portion of the code and replace the default layout templates in Phoenix's view at `lib/app/templates/layout/application.html.eex`.


    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Hello Phoenix!</title>
        <link rel="stylesheet" href="/static/css/app.css">
      </head>

      <body>
        <div class="container">

          <%= @inner %>

        </div> <!-- /container -->
        <script src="/static/js/pouchdb-2.2.0.min.js"></script>
        <script src="/static/js/app.js"></script>
      </body>
    </html>


Copy the lines inside `<body>` into `lib/pouch_journal_3/templates/pages/index.html.eex`.

    <h1>Hello PouchDB!</h1>
    <input type="text" name="title" placeholder="Insert your journal's title" autofocus id="title">
    <input type="text" name="text" id="text" placeholder="Start your journal here...">
    <button type="submit" onclick="addJournal()">Save</button>


    <ul id="journal-list">

    </ul>

Don't forget to also copy the [pouchdb-2.2.0.min.js](https://github.com/pouchdb/pouchdb/releases/tag/2.2.0) and `app.js` files into the `priv/static/js` folder. Now, restart `mix phoenix.start` and refresh our browser. Make sure our app doing just fine by inserting new data.  There should be no errors in the JavaScript console.

![screenshot](http://www.picamatic.com/show/2014/07/14/01/31/10589185_1167x681.png)

Wow, it already looks good! No wonder, Phoenix now ships with [Twitter Bootstrap](http://getbootstrap.com) so our app will look better.

Now, let's welcome [RactiveJS](http://www.ractivejs.org/) to the party!

## Intro To RactiveJS

Ractive was originally created at [theguardian.com](http://www.theguardian.com/) to produce news applications. Ractive takes [Mustache](http://mustache.github.com/) templates and transforms them into a lightweight representation of the DOM. When your data changes, it intelligently updates the real DOM.

In our app, any time the data changes, we redraw the DOM using `redrawUI` function in JavaScript. We are going to remove that function; by using RactiveJS when the data changes, the DOM will inteligently update itself.

But before that, let's first add RactiveJS and write "hello world" with it.

### Adding RactiveJS

Download the [ractive.js](http://cdn.ractivejs.org/latest/ractive.js) script [here](http://cdn.ractivejs.org/latest/ractive.js) and saved it in `priv/static/js` directory. Then add the script at the end of `lib/pouch_journal_3/pages/index.html.eex` file.

Then we add ractive template to show our "hello world" message. This better be in `lib/pouch_journal_3/templates/pages/index.html.eex` file.

    <h1>Hello PouchDB!</h1>
    <input type="text" name="title" placeholder="Insert your journal's title" autofocus id="title">
    <input type="text" name="text" id="text" placeholder="Start your journal here...">
    <button type="submit" onclick="addJournal()">Save</button>


    <ul id="journal-list">

    </ul>

    <div id="ractive">
      <p>Everything inside this ractive div will replaced by ractive!</p>
    </div>


    <script id='template' type='text/ractive'>
      <h2>Hello, {{name}}</h2>
    </script>

    <script src='static/js/ractive.min.js'></script>

    <script>
      var ractive = new Ractive({
        el: 'ractive',
        template: '#template',
        data: { name: 'world' }
      });
    </script>

We'll render our Ractive template into the `ractive` div id that we just created. Then we create a template with id `template` using
a special script tag. Last, but not least, we wired it up with Ractive script. Ractive will automatically change `{{name}}` to `world` because we set the value of the variable named `name` to "world".

![screenshot](http://www.picamatic.com/show/2014/07/14/01/33/10589191_1138x393.png)


Everything ok so far? Good. Before we move on, let's do something cool with RactiveJS. We already set a `name` variable in the ractive declaration. So we can set a new value to the `name` variable in JavaScript's console and type:

    >>> ractive.set('name', 'ElixirDose')

And see the template update itself! That's the magic of RactiveJS. 

For good practice, let's move Ractive's initiation code into `app.js`. Then, we'll move `ractive.min.js` to the application layout just before we load `app.js`.


    <h1>Hello PouchDB!</h1>
    <input type="text" name="title" placeholder="Insert your journal's title" autofocus id="title">
    <input type="text" name="text" id="text" placeholder="Start your journal here...">
    <button type="submit" onclick="addJournal()">Save</button>


    <ul id="journal-list">

    </ul>

    <div id="ractive">
      <p>Everything inside this ractive div will replaced by ractive!</p>
    </div>


    <script id='template' type='text/ractive'>
      <h2>Hello, {{name}}</h2>
    </script>
[index.html.eex]

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Hello Phoenix!</title>
        <link rel="stylesheet" href="/static/css/app.css">
      </head>

      <body>
        <div class="container" id="container">

          <%= @inner %>


        </div> <!-- /container -->
        <script src="/static/js/pouchdb-2.2.0.min.js"></script>
        <script src='static/js/ractive.min.js'></script>
        <script src="/static/js/app.js"></script>
      </body>
    </html>
[application.html.eex]


    var ractive = new Ractive({
      el: 'ractive',
        template: '#template',
        data: { name: 'world' }
    });

    var db = new PouchDB('journals');

    var remoteCouch = "http://localhost:5984/journals";
    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, function(err){
        console.log("Error: " + err); 
    });
    db.replicate.from(remoteCouch, opts);

    db.info(function (err, info){
      db.changes({
        since: info.update_seq,
        live: true
      }).on('change', showJournals);
    });

    function addJournal() {
      var title = document.getElementById('title').value;
      var text = document.getElementById('text').value;
      var journal = {
        title: title,
        text: text,
        publish: true
      };

      db.post(journal, function callback(err, result) {
        if (!err) {
          console.log("Successfully add a journal");
          document.getElementById('title').value = "";
          document.getElementById('text').value = "";

        }
      });
    }

    function showJournals() {
      db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        redrawUI(doc.rows);
      });
    }

    function redrawUI(journals) {
      var ul = document.getElementById('journal-list');
      ul.innerHTML = '';
      journals.forEach(function(journal) {
        var li = document.createElement('li');
        var text = document.createTextNode(journal.doc.title + " - " + journal.doc.text);
        li.appendChild(text);
        ul.appendChild(li);
      });
    }

    showJournals();


[app.js]

### Add Data Into RactiveJS

Now we can get rid of the `redrawUI` function and change it use the RactiveJS way.


    var ractive = new Ractive({
      el: 'ractive',
        template: '#template',
        data: { name: 'world' }
    });

    var db = new PouchDB('journals');

    var remoteCouch = "http://localhost:5984/journals";
    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, function(err){
        console.log("Error: " + err); 
    });
    db.replicate.from(remoteCouch, opts);

    db.info(function (err, info){
      db.changes({
        since: info.update_seq,
        live: true
      }).on('change', showJournals);
    });

    function addJournal() {
      var title = document.getElementById('title').value;
      var text = document.getElementById('text').value;
      var journal = {
        title: title,
        text: text,
        publish: true
      };

      db.post(journal, function callback(err, result) {
        if (!err) {
          console.log("Successfully add a journal");
          document.getElementById('title').value = "";
          document.getElementById('text').value = "";

        }
      });
    }

    function showJournals() {
      db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        // Remove this line
        // redrawUI(doc.rows);
      });
    }

    showJournals();



Then, we declare an array variable to save the query. After that, we send the `journals` variable into a ractive declaration.

    var journals = [];
    var ractive = new Ractive({
      el: 'ractive',
        template: '#template',
        data: { name: 'world',
          journals: journals
        
        }
    });

    var db = new PouchDB('journals');

    var remoteCouch = "http://localhost:5984/journals";
    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, function(err){
        console.log("Error: " + err); 
    });
    db.replicate.from(remoteCouch, opts);

    db.info(function (err, info){
      db.changes({
        since: info.update_seq,
        live: true
      }).on('change', showJournals);
    });

    function addJournal() {
      var title = document.getElementById('title').value;
      var text = document.getElementById('text').value;
      var journal = {
        title: title,
        text: text,
        publish: true
      };

      db.post(journal, function callback(err, result) {
        if (!err) {
          console.log("Successfully add a journal");
          document.getElementById('title').value = "";
          document.getElementById('text').value = "";

        }
      });
    }

    function showJournals() {
      db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        // Remove this line
        // redrawUI(doc.rows);
      });
    }

    showJournals();

Now let's convert our HTML template into a Ractive template for a list of journals.

    <script id='template' type='text/ractive'>
      <ul id="journal-list">
      {{#journals}}
      <li> {{doc.title}} - {{doc.text}}</li>
      {{/journals}}
      </ul>
    </script>

`{{#journal}}` is mustache-like template syntax that will iterate through all `journals` variables that we bind inside the Ractive declaration earlier.

If you refresh the browser, you'll see nothing yet. Because `journals` is still an empty array. Let's fill it up with query results:

    function showJournals() {
      db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        journals = doc.rows;
        ractive.set('journals', journals);
      });
    }

All we need to do is update the `showJournals()` function and assign query result `doc.row` into the `journals` array.
Then we set `journals` with `ractive.set` so the variable will be available in the template side.

That's pretty much it. We have changed redrawing DOM manually to a more elegant way with RactiveJS.

As a bonus, this is the demo video if you don't believe how easy it is to create real-time app using CouchDB and RactiveJS.

<iframe width="560" height="315" src="//www.youtube.com/embed/UruCkzxxYRM" frameborder="0" allowfullscreen></iframe>


## Conclusion

Clearly RactiveJS is an elegant library for us to manipulate the DOM. It certaintly is helpful if the app we build is big enough. Using vanilla JavaScript and or jQuery for manipulating DOM is ok for a while, but it tends to get messy when the project grows. This is where RactiveJS became useful.

One thing I don't like from RactiveJS is that they use `<script type...>`, which makes it harder to debug. If we try to inspect an element, we can't see the output. Instead, we just have `<script type..>` tags.

