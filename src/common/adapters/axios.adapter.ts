import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IHttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements IHttpAdapter {
  private readonly API_URL: string = 'https://pokeapi.co/api/v2/pokemon';
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
    });
  }
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.api.get<T>(url);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('This is an httpError - CheckLogs');
    }
  }
}
