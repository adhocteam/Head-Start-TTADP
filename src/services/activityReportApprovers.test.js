import db, {
  ActivityReport, ActivityReportApprover, User, sequelize,
} from '../models';
import { upsertApprover } from './activityReportApprovers';
import { activityReportById } from './activityReports';
import { REPORT_STATUSES } from '../constants';

const mockUser = {
  id: 1100,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const mockManager = {
  id: 2200,
  homeRegionId: 2,
  name: 'user2000',
  hsesUsername: 'user2000',
  hsesUserId: '2000',
};

const secondMockManager = {
  id: 3300,
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

let report1;
let report2;
let report3;

describe('Activity Reports Approvers', () => {
  beforeAll(async () => {
    await User.bulkCreate([mockUser, mockManager, secondMockManager]);
  });

  afterAll(async () => {
    await ActivityReportApprover.destroy({
      where: {
        activityReportId:
      [report1.id, report2.id, report3.id],
      },
    });
    await ActivityReport.destroy({ where: { id: [report1.id, report2.id, report3.id] } });
    await User.destroy({ where: { id: [mockUser.id, mockManager.id, secondMockManager.id] } });
    await db.sequelize.close();
  });

  describe('upsertApprover upserts approvers, updates calculatedStatus', () => {
    it('calculatedStatus is "needs action" if any approver "needs_action"', async () => {
      report1 = await ActivityReport.create(submittedReport);
      // One approved
      await ActivityReportApprover.create({
        activityReportId: report1.id,
        userId: mockManager.id,
        status: REPORT_STATUSES.APPROVED,
      });
      // One pending
      await ActivityReportApprover.create({
        activityReportId: report1.id,
        userId: secondMockManager.id,
      });
      // Works with managed transaction
      await sequelize.transaction(async (transaction) => {
        // Pending updated to needs_action
        const approver = await upsertApprover({
          status: REPORT_STATUSES.NEEDS_ACTION,
          activityReportId: report1.id,
          userId: secondMockManager.id,
        }, transaction);
        expect(approver.status).toEqual(REPORT_STATUSES.NEEDS_ACTION);
      });
      const updatedReport = await activityReportById(report1.id);
      expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.NEEDS_ACTION);
    });
    it('calculatedStatus is "approved" if all approvers approve', async () => {
      report2 = await ActivityReport.create(submittedReport);
      // One pending
      await ActivityReportApprover.create({
        activityReportId: report2.id,
        userId: mockManager.id,
      });
      // Pending updated to approved
      const approver = await upsertApprover({
        activityReportId: report2.id,
        userId: mockManager.id,
        status: REPORT_STATUSES.APPROVED,
      });
      expect(approver.status).toEqual(REPORT_STATUSES.APPROVED);
      const updatedReport = await activityReportById(report2.id);
      expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.APPROVED);
    });
    it('calculatedStatus is "submitted" if approver is pending', async () => {
      report3 = await ActivityReport.create(submittedReport);
      // One approved
      await ActivityReportApprover.create({
        activityReportId: report3.id,
        userId: mockManager.id,
        status: REPORT_STATUSES.APPROVED,
      });
      // One pending
      const approver = await upsertApprover({
        activityReportId: report3.id,
        userId: secondMockManager.id,
      });
      expect(approver.status).toBeNull();
      const updatedReport = await activityReportById(report3.id);
      expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.SUBMITTED);
    });
  });
});
