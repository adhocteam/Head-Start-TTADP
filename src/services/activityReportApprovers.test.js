import db, {
  ActivityReport, ActivityRecipient, User, Grantee, NonGrantee, Grant, NextStep, Region,
} from '../models';
import {
  createOrUpdate,
  activityReportById,
  possibleRecipients,
  activityReports,
  activityReportAlerts,
  activityReportByLegacyId,
  getDownloadableActivityReportsByIds,
  getAllDownloadableActivityReports,
  getAllDownloadableActivityReportAlerts,
} from './activityReports';
import { upsertApprover } from './activityReportApprovers';
import { REPORT_STATUSES } from '../constants';

const GRANTEE_ID = 30;
const GRANTEE_ID_SORTING = 31;

const mockUser = {
  id: 1000,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const draftReport = {
  userId: mockUser.id,
  regionId: 1,
  submissionStatus: REPORT_STATUSES.DRAFT,
  numberOfParticipants: 1,
  deliveryMethod: 'method',
  duration: 0,
  endDate: '2000-01-01T12:00:00Z',
  startDate: '2000-01-01T12:00:00Z',
  activityRecipientType: 'something',
  requester: 'requester',
  programTypes: ['type'],
  targetPopulations: ['pop'],
  reason: ['reason'],
  participants: ['participants'],
  topics: ['topics'],
  ttaType: ['type'],
  activityRecipientType: 'something',
};

const singleApproverSubmittedReport = {
  ...draftReport,
  submissionStatus: REPORT_STATUSES.SUBMITTED,
  oldApprovingManagerId: 1,
};

// TODO: prune imports and consts (c/p from activityReports.test.js)
describe('Activity Reports DB service', () => {
  beforeAll(async () => {
    await User.create(mockUser);
    await Grantee.findOrCreate({ where: { name: 'grantee', id: GRANTEE_ID } });
    await Region.create({ name: 'office 17', id: 17 });
    await Grant.create({
      id: GRANTEE_ID, number: 1, granteeId: GRANTEE_ID, regionId: 17, status: 'Active',
    });
    await NonGrantee.create({ id: GRANTEE_ID, name: 'nonGrantee' });
  });

  afterAll(async () => {
    const reports = await ActivityReport
      .findAll({ where: { userId: [mockUser.id] } });
    const ids = reports.map((report) => report.id);
    await NextStep.destroy({ where: { activityReportId: ids } });
    await ActivityRecipient.destroy({ where: { activityReportId: ids } });
    await ActivityReport.destroy({ where: { id: ids } });
    await User.destroy({ where: { id: [mockUser.id] } });
    await NonGrantee.destroy({ where: { id: GRANTEE_ID } });
    await Grant.destroy({ where: { id: [GRANTEE_ID, GRANTEE_ID_SORTING] } });
    await Grantee.destroy({ where: { id: [GRANTEE_ID, GRANTEE_ID_SORTING] } });
    await Region.destroy({ where: { id: 17 } });
    await db.sequelize.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // This was moved from Activity Report
  describe('upsertApprover', () => {
    it('can set the report as needs action', async () => {
      const report = await ActivityReport.create(singleApproverSubmittedReport);
      const approver = await upsertApprover({
        status: REPORT_STATUSES.NEEDS_ACTION,
        note: 'notes',
      }, {
        activityReportId: report.id,
        userId: report.oldApprovingManagerId,
      });
      const updatedReport = await ActivityReport.findByPk(report.id);
      expect(approver.status).toEqual(REPORT_STATUSES.NEEDS_ACTION);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.NEEDS_ACTION);
    });

    it('when setting the report to approved', async () => {
      const report = await ActivityReport.create(singleApproverSubmittedReport);
      const approver = await upsertApprover({
        status: REPORT_STATUSES.APPROVED,
        note: 'notes',
      }, {
        activityReportId: report.id,
        userId: report.oldApprovingManagerId,
      });
      const updatedReport = await ActivityReport.findByPk(report.id);
      expect(approver.status).toEqual(REPORT_STATUSES.APPROVED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.APPROVED);
    });
  });
});
