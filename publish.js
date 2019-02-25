const ghpages = require('gh-pages');
ghpages.publish('./dist', {
  branch: 'pages',
}, function(err) {
  console.log('done!');
});
