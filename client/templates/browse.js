if (Meteor.isClient) {
    // This code only runs on the client
    Template.browse.helpers({
        chunks: function () {
            return ChunkList.find();
        }
    });
}
