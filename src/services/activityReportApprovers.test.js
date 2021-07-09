import db, {
  ActivityReport, ActivityReportApprover, User, sequelize,
} from '../models';
import { upsertApprover } from './activityReportApprovers';
import { activityReportById } from './activityReports';
import { REPORT_STATUSES } from '../constants';

const mockUser = {
  id: 1000,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const mockManager = {
  id: 2000,
  homeRegionId: 2,
  name: 'user2000',
  hsesUsername: 'user2000',
  hsesUserId: '2000',
};

const secondMockManager = {
  id: 3000,
  homeRegionId: 3,
  name: 'user3000',
  hsesUsername: 'user3000',
  hsesUserId: '3000',
};

const submittedReport = {
  userId: mockUser.id,
  regionId: 1,
  submissionStatus: REPORT_STATUSES.SUBMITTED,
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
};

describe('Activity Reports Approvers', () => {
  beforeAll(async () => {
    await User.create(mockUser);
    await User.create(mockManager);
    await User.create(secondMockManager);
  });

  afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await db.sequelize.close();
  });

  describe('upsertApprover upserts approvers, updates calculatedStatus', () => {
    it('calculatedStatus is "needs action" if any approver "needs_action"', async () => {
      const report = await ActivityReport.create(submittedReport);
      // One approved
      await ActivityReportApprover.create({
        activityReportId: report.id,
        userId: mockManager.id,
        status: REPORT_STATUSES.APPROVED,
      });
      // One pending
      await ActivityReportApprover.create({
        activityReportId: report.id,
        userId: secondMockManager.id,
      });
      // Works with managed transaction
      await sequelize.transaction(async (transaction) => {
        // Pending updated to needs_action
        const approver = await upsertApprover({
          status: REPORT_STATUSES.NEEDS_ACTION,
          activityReportId: report.id,
          userId: secondMockManager.id,
        }, transaction);
        expect(approver.status).toEqual(REPORT_STATUSES.NEEDS_ACTION);
      });
      const updatedReport = await activityReportById(report.id);
      expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.NEEDS_ACTION);
    });
    it('calculatedStatus is "approved" if all approvers approve', async () => {
      const report = await ActivityReport.create(submittedReport);
      // One pending
      await ActivityReportApprover.create({
        activityReportId: report.id,
        userId: mockManager.id,
      });
      // Pending updated to approved
      const approver = await upsertApprover({
        activityReportId: report.id,
        userId: mockManager.id,
        status: REPORT_STATUSES.APPROVED,
      });
      expect(approver.status).toEqual(REPORT_STATUSES.APPROVED);
      const updatedReport = await activityReportById(report.id);
      expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.APPROVED);
    });
    it('calculatedStatus is "submitted" if approver is pending', async () => {
      const report = await ActivityReport.create(submittedReport);
      // One approved
      await ActivityReportApprover.create({
        activityReportId: report.id,
        userId: mockManager.id,
        status: REPORT_STATUSES.APPROVED,
      });
      // One pending
      const approver = await upsertApprover({
        activityReportId: report.id,
        userId: secondMockManager.id,
      });
      expect(approver.status).toBeNull();
      const updatedReport = await activityReportById(report.id);
      expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.SUBMITTED);
    });
  });
});
