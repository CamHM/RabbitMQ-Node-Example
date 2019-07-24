let amqp = require('amqplib/callback_api');

amqp.connect('amqp://', (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }
        let queue = "tasks";
        let message = process.argv.slice(2).join(' ') || "Hello world..... ";

        channel.assertQueue(queue, {
            durable: true   // Indica a RabbitMQ que la cola debe seguir existiendo inclusive si el servidor falla
        });
        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: true    // Indica a RabbitMQ que debe almacenar los mensajes en disco
        });
        console.log("[x] Sent %s'", message);
    });

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
