const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

const amqp = require("amqplib");
var channel, connection;


connectQueue() // call connectQueue function
async function connectQueue() {
    try {

        connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
        channel = await connection.createChannel()
        
        // connect to 'queue', create one if doesnot exist already
        await channel.assertQueue("orders-intelisis-queue")
        
        channel.consume("orders-intelisis-queue", data => {
            console.log("Data received : ", `${Buffer.from(data.content)}` );

            let order = `${Buffer.from(data.content)}`
            order = JSON.parse(order)
            console.log(order)

            channel.ack(data)
        })

    } catch (error) {
        console.log(error)
    }
}

app.listen(PORT, () => console.log("Server running at port " + PORT));
