import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      message: 'CampusAttach Backend is running!',
      status: 'success',
      platform: 'CampusAttach - Student Attachment and Internship Opportunity Platform',
      api: '/api',
      documentation: '/api',
    };
  }
}
