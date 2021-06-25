import { checkActivityReportParam, checkReportAndFileParams } from './checkIdParamMiddleware';
import { auditLogger } from '../logger';

jest.mock('../lib/apiErrorHandler', () => jest.fn().mockReturnValue(() => Promise.resolve()));
jest.mock('../logger');

const mockResponse = {
  status: jest.fn(() => ({
    send: jest.fn(),
  })),
};
const mockNext = jest.fn();
const errorMessage = 'Received malformed request params';

describe('checkIdParamMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkActivityReportParam', () => {
    it('calls next if activity report is integer', () => {
      const mockRequest = {
        path: '/api/endpoint',
        params: {
          activityReportId: '10',
        },
      };

      checkActivityReportParam(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('throw 400 if activity report is not an integer', () => {
      const mockRequest = {
        path: '/api/endpoint',
        params: {
          activityReportId: '1#0',
        },
      };

      checkActivityReportParam(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(auditLogger.error).toHaveBeenCalledWith(errorMessage);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throw 400 if activity report param is missing', () => {
      const mockRequest = { path: '/api/endpoint' };

      checkActivityReportParam(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(auditLogger.error).toHaveBeenCalledWith(errorMessage);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('checkReportAndFileParams', () => {
    it('calls next if report and file id are integer', () => {
      const mockRequest = {
        path: '/api/endpoint',
        params: {
          fileId: '1',
          reportId: '2',
        },
      };

      checkReportAndFileParams(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('throw 400 if param is not an integer', () => {
      const mockRequest = {
        path: '/api/endpoint',
        params: {
          reportId: '1x',
          fileId: '2',
        },
      };

      checkReportAndFileParams(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(auditLogger.error).toHaveBeenCalledWith(errorMessage);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('throw 400 if param is missing', () => {
      const mockRequest = {
        path: '/api/endpoint',
        params: {
          reportId: '1',
        },
      };

      checkReportAndFileParams(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(auditLogger.error).toHaveBeenCalledWith(errorMessage);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
