// File: backend/src/infrastructure/status-tracking/status.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  private statuses = {};

  updateStatus(id: string, status: string) {
    this.statuses[id] = status;
  }

  getStatus(id: string) {
    return this.statuses[id];
  }
}
