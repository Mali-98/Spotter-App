// src/chat/chat.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatHistory } from './entities/chat-history.entity';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatService {
  private readonly apiKey = process.env.GROQ_API_KEY;

  constructor(
    @InjectRepository(ChatHistory)
    private chatHistoryRepo: Repository<ChatHistory>,
  ) { }

  async getChatResponse(message: string, userId: string): Promise<string> {
    // Save user message
    await this.chatHistoryRepo.save({
      userId,
      role: 'user',
      message,
    });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const aiResponse = response.data.choices[0].message.content;

    // Save assistant response
    await this.chatHistoryRepo.save({
      userId,
      role: 'assistant',
      message: aiResponse,
    });

    return aiResponse;
  }

  async getHistory(userId: string): Promise<ChatHistory[]> {
    return this.chatHistoryRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }
}
