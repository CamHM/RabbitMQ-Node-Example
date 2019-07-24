let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }
        let queue = "tasks";

        channel.assertQueue(queue, {
            durable: true   // Indica a RabbitMQ que la cola debe seguir existiendo inclusive si el servidor falla
        });
        channel.fetch(1); // Establece que el trabajador sólo recibirá un mensaje a la vez
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, (message) => {
            let secs = message.content.toString().split('.').length - 1;

            console.log(' [x] Received %s', message.content.toString());
            setTimeout(() => {
                console.log(' [x] Done');
            }, secs * 1000);
        }, {
            noAck: false // Automatic acknowledgment (data safety) Para evitar la pérdida de mensajes
        });
    });
});
