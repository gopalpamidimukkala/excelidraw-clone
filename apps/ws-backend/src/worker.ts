import { prismaClient } from "@repo/db/client";
import { Redis } from 'ioredis';
import { Job, Worker } from "bullmq";

const connection = new Redis({
    host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
})
const worker = new Worker('chatQueue', async (job: any) => {
    const { roomId, message, userId } = job.data;

    await prismaClient.chat.create({
        data : {
            roomId,
            message,
            userId
        }
    })
}, {
  connection,
  concurrency: 5 
});

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`)
});
worker.on('failed', (job, error) => {
    console.log(`Job ${job?.id} failed`, error)
})