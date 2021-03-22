var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1
mongoose.connect(process.env.MONGO_DB); // 2
var db = mongoose.connection; //3

var postSchema = mongoose.Schema( {
  writer: {type:String, required:true},
  content: {type:String, required:true}
});

var Post = mongoose.model('post', postSchema);

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
  Post.find({}, function(err, posts) {
    if (err) res.json(err);
    res.render('board', {posts: posts});
  });
});

app.get('/posts/:id/delete', function (req, res) {
  Post.deleteOne({_id: req.params.id}, function(err){
    if (err) return res.json(err);
    res.redirect('/');
  });
});

app.get('/posts/:id', function(req, res) {
  Post.findOne({_id: req.params.id}, function(err, post) {
    if (err) return res.json(err);
    res.render('post', {post: post});
  });
});

app.get('/new', function(req, res) {
  res.render('new');
});
app.post('/new', function(req, res) {
  Post.create(req.body, function(err, post) {
    if(err) res.json(err);
    res.redirect('/');
  });
});

// 서버를 3000 포트로 열기
var port = 3000;
app.listen(port, function() {
  console.log('server is on port:' + port);
});
