import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Public } from '../auth/jwt-auth.guard';

@Controller()
export class ProxyController {
  private proxies: Record<string, any> = {
    auth: createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/auth': '' },
    }),
    student: createProxyMiddleware({
      target: process.env.STUDENT_SERVICE_URL || 'http://localhost:3002',
      changeOrigin: true,
      pathRewrite: { '^/student': '' },
    }),
    academic: createProxyMiddleware({
      target: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3008',
      changeOrigin: true,
      pathRewrite: { '^/academic': '' },
    }),
    attendance: createProxyMiddleware({
      target: process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3010',
      changeOrigin: true,
      pathRewrite: { '^/attendance': '' },
    }),
    examination: createProxyMiddleware({
      target: process.env.EXAMINATION_SERVICE_URL || 'http://localhost:3009',
      changeOrigin: true,
      pathRewrite: { '^/examination': '' },
    }),
    };

    @Public()
    @All('auth/*')
    async proxyAuth(@Req() req: Request, @Res() res: Response) {
    this.proxies.auth(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
    }

    @All('student/*')
    async proxyStudent(@Req() req: Request, @Res() res: Response) {
    this.proxies.student(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
    }

    @All('academic/*')
    async proxyAcademic(@Req() req: Request, @Res() res: Response) {
    this.proxies.academic(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
    }

    @All('attendance/*')
    async proxyAttendance(@Req() req: Request, @Res() res: Response) {
    this.proxies.attendance(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
    }

    @All('examination/*')
    async proxyExamination(@Req() req: Request, @Res() res: Response) {
    this.proxies.examination(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
    }

    @All('api/v1/students/*')  async proxyStudentV1(@Req() req: Request, @Res() res: Response) {
      // Map to student service as well
      this.proxies.student(req, res, (err) => {
          if (err) {
              res.status(500).send(err.message);
          }
      });
  }
}
