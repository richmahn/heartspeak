Books = new Ground.Collection('books', { connection: null });

Books.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Books.latest = function() {
  return Books.find({}, {sort: {date: -1}, limit: 1});
}

// Initialize a seed book
Meteor.startup(function() {
  if (Meteor.isClient && Books.find().count() === 0) {
    Books.insert({
      title: 'The Gospel of John',
      image: '/img/book/bible1.png',
      date: new Date
    });
  }
});
