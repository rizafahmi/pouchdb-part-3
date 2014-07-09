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
    // redrawUI(doc.rows);
  });
}

showJournals();
