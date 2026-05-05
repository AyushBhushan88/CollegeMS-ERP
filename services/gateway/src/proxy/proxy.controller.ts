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
    admission: createProxyMiddleware({
      target: process.env.ADMISSION_SERVICE_URL || 'http://localhost:3004',
      changeOrigin: true,
      pathRewrite: { '^/admission': '' },
    }),
    finance: createProxyMiddleware({
      target: process.env.FINANCE_SERVICE_URL || 'http://localhost:3003',
      changeOrigin: true,
      pathRewrite: { '^/finance': '' },
    }),
    communication: createProxyMiddleware({
      target: process.env.COMMUNICATION_SERVICE_URL || 'http://localhost:3006',
      changeOrigin: true,
      pathRewrite: { '^/communication': '' },
    }),
    hr: createProxyMiddleware({
      target: process.env.HR_SERVICE_URL || 'http://localhost:3005',
      changeOrigin: true,
      pathRewrite: { '^/hr': '' },
    }),
    library: createProxyMiddleware({
      target: process.env.LIBRARY_SERVICE_URL || 'http://localhost:3007',
      changeOrigin: true,
      pathRewrite: { '^/library': '' },
    }),
    hostel: createProxyMiddleware({
      target: process.env.HOSTEL_SERVICE_URL || 'http://localhost:3011',
      changeOrigin: true,
      pathRewrite: { '^/hostel': '' },
    }),
    placement: createProxyMiddleware({
      target: process.env.PLACEMENT_SERVICE_URL || 'http://localhost:3012',
      changeOrigin: true,
      pathRewrite: { '^/placement': '' },
    }),
    transport: createProxyMiddleware({
      target: process.env.TRANSPORT_SERVICE_URL || 'http://localhost:3013',
      changeOrigin: true,
      pathRewrite: { '^/transport': '' },
    }),
    report: createProxyMiddleware({
      target: process.env.REPORT_SERVICE_URL || 'http://localhost:3014',
      changeOrigin: true,
      pathRewrite: { '^/report': '' },
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

  @All('hr/*')
  async proxyHR(@Req() req: Request, @Res() res: Response) {
    this.proxies.hr(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('library/*')
  async proxyLibrary(@Req() req: Request, @Res() res: Response) {
    this.proxies.library(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('hostel/*')
  async proxyHostel(@Req() req: Request, @Res() res: Response) {
    this.proxies.hostel(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('placement/*')
  async proxyPlacement(@Req() req: Request, @Res() res: Response) {
    this.proxies.placement(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('transport/*')
  async proxyTransport(@Req() req: Request, @Res() res: Response) {
    this.proxies.transport(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('admission/*')
  async proxyAdmission(@Req() req: Request, @Res() res: Response) {
    this.proxies.admission(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('finance/*')
  async proxyFinance(@Req() req: Request, @Res() res: Response) {
    this.proxies.finance(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('communication/*')
  async proxyCommunication(@Req() req: Request, @Res() res: Response) {
    this.proxies.communication(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }

  @All('report/*')
  async proxyReport(@Req() req: Request, @Res() res: Response) {
    this.proxies.report(req, res, (err) => {
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

  @All('api/v1/students/*') async proxyStudentV1(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Map to student service as well
    this.proxies.student(req, res, (err) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });
  }
}
