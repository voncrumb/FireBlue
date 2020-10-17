const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;


var chats = [];


function createChat(){

mongo.connect('mongodb+srv://admin:admin@cluster0.buc2l.mongodb.net/database?retryWrites=true&w=majority', function(err, db){
    console.log("yeet")
    if(err){
        throw err;
    }
    console.log("dab")

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        console.log("connection")
    
        let chat = db.db("database").collection('chats');
        console.log("chats")
        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find({}).limit(100).sort({_id:1}).toArray(function(err, res){
            console.log('finding chats')
            if(err){
                throw err;
            }
            console.log("got chats")

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data){
            console.log("inputing")
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insertOne({name: name, message: message}, function(){
                    client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});
}




// Connect to mongo
