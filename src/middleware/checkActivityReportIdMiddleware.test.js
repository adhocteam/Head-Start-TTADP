import checkActivityReportIdMiddleware from './checkActivityReportIdMiddleware';
import { auditLogger } from '../logger';

jest.mock('../lib/apiErrorHandler', () => jest.fn().mockReturnValue(() => Promise.resolve()));
jest.mock('../logger');

const path = 'api/activity-reports/:activityReportId/review';

describe('checkActivityReportIdMiddleware', () => {
  it('calls next if activity report is integer', async () => {
    const mockRequest = {
      path,
      params: {
        activityReportId: '10',
      },
    };
    const mockResponse = {
      redirect: jest.fn(),
      sendStatus: jest.fn(),
    };
    const mockNext = jest.fn();

    await checkActivityReportIdMiddleware(mockRequest, mockResponse, mockNext);
    expect(mockResponse.sendStatus).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('throw 400 if activity report is not an integer', async () => {
    const mockRequest = {
      path,
      params: {
        activityReportId: '1#0',
      },
    };
    const mockResponse = {
      redirect: jest.fn(),
      sendStatus: jest.fn(),
    };
    const mockNext = jest.fn();

    await checkActivityReportIdMiddleware(mockRequest, mockResponse, mockNext);
    expect(auditLogger.error).toHaveBeenCalledWith('Received malformed activityReportId: "1#0"');
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
