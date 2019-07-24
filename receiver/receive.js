let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        let queueHello = "hello";

        channel.assertQueue(queueHello, {
            durable: false
        });

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queueHello);

        channel.consume(queueHello, (message) => {
            console.log(' [x] Received %s', message.content.toString());
        }, {
            noAck: true
        });
    });
});
