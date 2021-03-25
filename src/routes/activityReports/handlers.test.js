import {
  getReport,
  saveReport,
  createReport,
  getActivityRecipients,
  getApprovers,
  submitReport,
  reviewReport,
  resetToDraft,
  getReports,
  getReportAlerts,
  getLegacyReport,
  downloadReports,
} from './handlers';
import {
  activityReportById,
  createOrUpdate,
  possibleRecipients,
  review,
  setStatus,
  activityReports,
  activityReportAlerts,
  activityReportByLegacyId,
  getDownloadableActivityReports,
} from '../../services/activityReports';
import { userById, usersWithPermissions } from '../../services/users';
import ActivityReport from '../../policies/activityReport';
import handleErrors from '../../lib/apiErrorHandler';
import User from '../../policies/user';

jest.mock('../../services/activityReports', () => ({
  activityReportById: jest.fn(),
  createOrUpdate: jest.fn(),
  possibleRecipients: jest.fn(),
  review: jest.fn(),
  setStatus: jest.fn(),
  activityReports: jest.fn(),
  activityReportAlerts: jest.fn(),
  activityReportByLegacyId: jest.fn(),
  getDownloadableActivityReports: jest.fn(),
}));

jest.mock('../../services/users', () => ({
  userById: jest.fn(),
  usersWithPermissions: jest.fn(),
}));

jest.mock('../../policies/user');
jest.mock('../../policies/activityReport');
jest.mock('../../lib/apiErrorHandler');

const mockResponse = {
  attachment: jest.fn(),
  json: jest.fn(),
  send: jest.fn(),
  sendStatus: jest.fn(),
  status: jest.fn(() => ({
    end: jest.fn(),
  })),
};

const mockRequest = {
  session: {
    userId: 1,
  },
};

const report = {
  id: 1,
  resourcesUsed: 'resources',
  userId: 1,
};

describe('Activity Report handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('activityReportByLegacyId', () => {
    const request = {
      ...mockRequest,
      params: { legacyReportId: 1 },
    };

    it('returns a report', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canViewLegacy: () => true,
      }));
      activityReportByLegacyId.mockResolvedValue({ id: 1 });
      await getLegacyReport(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('handles report not being found', async () => {
      activityReportByLegacyId.mockResolvedValue(null);
      await getLegacyReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });

    it('handles unauthorized', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canViewLegacy: () => false,
      }));
      activityReportByLegacyId.mockResolvedValue({ region: 1 });
      await getLegacyReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('reviewReport', () => {
    const request = {
      ...mockRequest,
      params: { activityReportId: 1 },
      body: { status: 'Approved', managerNotes: 'notes' },
    };

    it('returns the new status', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canReview: () => true,
      }));
      activityReportById.mockResolvedValue({ status: 'Approved' });
      review.mockResolvedValue({ status: 'Approved' });
      userById.mockResolvedValue({
        id: 1,
      });
      await reviewReport(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ status: 'Approved' });
    });

    it('handles unauthorizedRequests', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canReview: () => false,
      }));
      activityReportById.mockResolvedValue({ status: 'Approved' });
      await reviewReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('submitReport', () => {
    const request = {
      ...mockRequest,
      params: { activityReportId: 1 },
      body: { approvingManagerId: 1, additionalNotes: 'notes' },
    };

    it('returns the report', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canUpdate: () => true,
      }));
      createOrUpdate.mockResolvedValue(report);
      userById.mockResolvedValue({
        id: 1,
      });
      await submitReport(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(report);
    });

    it('handles unauthorizedRequests', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canUpdate: () => false,
      }));
      activityReportById.mockResolvedValue(report);
      userById.mockResolvedValue({
        id: 1,
      });
      await submitReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('createReport', () => {
    const request = {
      ...mockRequest,
      params: { activityReportId: 1 },
      body: { resourcesUsed: 'test' },
    };

    it('returns the created report', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canCreate: () => true,
      }));
      createOrUpdate.mockResolvedValue(report);
      userById.mockResolvedValue({
        id: 1,
      });
      await createReport(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(report);
    });

    it('handles empty requests', async () => {
      const { body, ...withoutBody } = request;
      await createReport(withoutBody, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });

    it('handles unauthorized requests', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canCreate: () => false,
      }));
      userById.mockResolvedValue({
        id: 1,
      });
      await createReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('saveReport', () => {
    const request = {
      ...mockRequest,
      params: { activityReportId: 1 },
      body: { resourcesUsed: 'test' },
    };

    it('returns the updated report', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canUpdate: () => true,
      }));
      activityReportById.mockResolvedValue(report);
      createOrUpdate.mockResolvedValue(report);
      userById.mockResolvedValue({
        id: 1,
      });
      await saveReport(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(report);
    });

    it('handles unauthorized requests', async () => {
      activityReportById.mockResolvedValue(report);
      ActivityReport.mockImplementationOnce(() => ({
        canUpdate: () => false,
      }));
      userById.mockResolvedValue({
        id: 1,
      });
      await saveReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });

    it('handles reports that are not found', async () => {
      activityReportById.mockResolvedValue(null);
      await saveReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });

    it('handles empty requests', async () => {
      const { body, ...withoutBody } = request;
      await saveReport(withoutBody, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('getReport', () => {
    const request = {
      ...mockRequest,
      params: { activityReportId: 1 },
    };

    it('returns the report', async () => {
      ActivityReport.mockImplementationOnce(() => ({
        canGet: () => true,
      }));
      activityReportById.mockResolvedValue(report);
      userById.mockResolvedValue({
        id: 1,
      });

      await getReport(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(report);
    });

    it('handles reports that are not found', async () => {
      activityReportById.mockResolvedValue(null);
      await getReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });

    it('handles unauthorized requests', async () => {
      activityReportById.mockResolvedValue(report);
      ActivityReport.mockImplementationOnce(() => ({
        canGet: () => false,
      }));
      await getReport(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('getActivityRecipients', () => {
    it('returns recipients when region query param is passed', async () => {
      const response = [{ test: 'test' }];
      possibleRecipients.mockResolvedValue(response);

      const mockRequestWithRegion = { ...mockRequest, query: { region: 14 } };
      await getActivityRecipients(mockRequestWithRegion, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it('returns recipients when regions query param is not passed', async () => {
      const response = [{ test: 'test' }];
      possibleRecipients.mockResolvedValue(response);

      const mockRequestWithNoRegion = { ...mockRequest, query: {} };
      await getActivityRecipients(mockRequestWithNoRegion, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });
  });

  describe('getApprovers', () => {
    it('returns a list of approvers', async () => {
      User.mockImplementation(() => ({
        canViewUsersInRegion: () => true,
      }));
      const response = [{ name: 'name', id: 1 }];
      usersWithPermissions.mockResolvedValue(response);
      await getApprovers({ ...mockRequest, query: { region: 1 } }, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it('handles unauthorized', async () => {
      User.mockImplementation(() => ({
        canViewUsersInRegion: () => false,
      }));
      const response = [{ name: 'name', id: 1 }];
      usersWithPermissions.mockResolvedValue(response);
      await getApprovers({ ...mockRequest, query: { region: 1 } }, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('resetToDraft', () => {
    const request = {
      ...mockRequest,
      params: { activityReportId: 1 },
    };

    it('returns the updated report', async () => {
      const result = { status: 'draft' };
      ActivityReport.mockImplementation(() => ({
        canReset: () => true,
      }));
      setStatus.mockResolvedValue(result);
      await resetToDraft(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('handles unauthorized', async () => {
      ActivityReport.mockImplementation(() => ({
        canReset: () => false,
      }));
      await resetToDraft(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('getReports', () => {
    const request = {
      ...mockRequest,
      query: { },
    };

    it('returns the reports', async () => {
      activityReports.mockResolvedValue({ count: 1, rows: [report] });
      userById.mockResolvedValue({
        id: 1,
      });

      await getReports(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 1, rows: [report] });
    });

    it('handles a list of reports that are not found', async () => {
      activityReports.mockResolvedValue(null);
      await getReports(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });
  });

  describe('getReportAlerts', () => {
    const request = {
      ...mockRequest,
      query: { },
    };

    it('returns my alerts', async () => {
      activityReportAlerts.mockResolvedValue({ count: 1, rows: [report] });
      userById.mockResolvedValue({
        id: 1,
      });

      await getReportAlerts(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ alertsCount: 1, alerts: [report] });
    });

    it('handles a list of alerts that are not found', async () => {
      activityReportAlerts.mockResolvedValue(null);
      await getReportAlerts(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });
  });

  describe('downloadReports', () => {
    it('returns a csv with appopriate headers when format=csv', async () => {
      const request = {
        ...mockRequest,
        query: { format: 'csv' },
      };

      const downloadableReport = {
        id: 616,
        author: {
          name: 'Arty',
        },
      };

      getDownloadableActivityReports.mockResolvedValue({ count: 1, rows: [downloadableReport] });
      await downloadReports(request, mockResponse);
      expect(mockResponse.attachment).toHaveBeenCalled();

      expect(mockResponse.send).toHaveBeenCalled();
      const [[value]] = mockResponse.send.mock.calls;
      /* eslint-disable no-useless-escape */
      expect(value).toMatch('\"displayId\"');
      expect(value).toMatch('\"Arty\"');
      /* eslint-enable no-useless-escape */
    });

    it('returns a 404 if we cannot get any reports', async () => {
      const request = {
        ...mockRequest,
        query: { format: 'csv' },
      };

      getDownloadableActivityReports.mockResolvedValue(null);
      await downloadReports(request, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });

    it('returns json when no format is specified', async () => {
      const request = {
        ...mockRequest,
      };

      const downloadableReport = {
        id: 616,
        author: {
          name: 'Arty',
        },
      };

      getDownloadableActivityReports.mockResolvedValue({ count: 1, rows: [downloadableReport] });
      await downloadReports(request, mockResponse);
      expect(mockResponse.attachment).not.toHaveBeenCalled();

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('handles thrown errors', async () => {
      const request = {
        ...mockRequest,
      };

      getDownloadableActivityReports.mockRejectedValueOnce(new Error('Something went wrong!'));

      await downloadReports(request, mockResponse);
      expect(handleErrors).toHaveBeenCalled();
    });

    it('returns an empty value when no ids match and format=csv', async () => {
      const request = {
        ...mockRequest,
        query: { report: [], format: 'csv' },
      };

      getDownloadableActivityReports.mockResolvedValue({ count: 0, rows: [] });
      await downloadReports(request, mockResponse);
      expect(mockResponse.attachment).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();

      const [[value]] = mockResponse.send.mock.calls;
      expect(value).toEqual('');
    });
  });
});
