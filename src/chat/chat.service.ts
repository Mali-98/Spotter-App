// src/chat/chat.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatHistory } from './entities/chat-history.entity';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  private readonly apiKey = process.env.GROQ_API_KEY;

  constructor(
    @InjectRepository(ChatHistory)
    private chatHistoryRepo: Repository<ChatHistory>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async getChatResponse(message: string, userId: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Save user message
    await this.chatHistoryRepo.save({
      user,
      role: 'user',
      message,
    });

    // Get recent messages
    const recentMessages = await this.chatHistoryRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
      take: 20,
    });

    const messages = recentMessages.map(msg => ({
      role: msg.role,
      content: msg.message,
    }));

    messages.push({ role: 'user', content: message });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages,
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
      user,
      role: 'assistant',
      message: aiResponse,
    });

    return aiResponse;
  }



  async getHistory(userId: string): Promise<ChatHistory[]> {
    return this.chatHistoryRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });
  }
}
