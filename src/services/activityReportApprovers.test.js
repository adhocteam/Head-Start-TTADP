import db, { ActivityReport, ActivityReportApprover, User } from '../models';
import { upsertApprover } from './activityReportApprovers';
import { REPORT_STATUSES } from '../constants';

const mockUser = {
  id: 1000,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const mockManger = {
  id: 2000,
  homeRegionId: 2,
  name: 'user2000',
  hsesUsername: 'user2000',
  hsesUserId: '2000',
};

const secondMockManger = {
  id: 3000,
  homeRegionId: 3,
  name: 'user3000',
  hsesUsername: 'user3000',
  hsesUserId: '3000',
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
};

const singleApproverSubmittedReport = {
  ...draftReport,
  submissionStatus: REPORT_STATUSES.SUBMITTED,
  oldApprovingManagerId: mockManger.id,
};

const multiApproverSubmittedReport = {
  ...draftReport,
  submissionStatus: REPORT_STATUSES.SUBMITTED,
};

describe('Activity Reports Approvers', () => {
  beforeAll(async () => {
    await User.create(mockUser);
    await User.create(mockManger);
    await User.create(secondMockManger);
  });

  afterAll(async () => {
    const reports = await ActivityReport
      .findAll({ where: { userId: [mockUser.id] } });
    const ids = reports.map((report) => report.id);
    await ActivityReport.destroy({ where: { id: ids } });
    await User.destroy({ where: { id: [mockUser.id] } });
    await db.sequelize.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertApprover upserts approvers, updates calculatedStatus', () => {
    describe('when manager assigned by old "single approver" method', () => {
      it('creates new "needs action" review', async () => {
        const report = await ActivityReport.create(singleApproverSubmittedReport);
        const approver = await upsertApprover({
          status: REPORT_STATUSES.NEEDS_ACTION,
          note: 'notes',
        }, {
          activityReportId: report.id,
          userId: report.oldApprovingManagerId,
        });
        expect(approver.status).toEqual(REPORT_STATUSES.NEEDS_ACTION);
        const updatedReport = await ActivityReport.findByPk(report.id);
        expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.NEEDS_ACTION);
      });
      it('creates new "approved" review', async () => {
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
    describe('when manager assigned by new "multi approver" method', () => {
      it('updates review to "needs action"', async () => {
        const report = await ActivityReport.create(multiApproverSubmittedReport);
        await ActivityReportApprover.create({
          activityReportId: report.id,
          userId: mockManger.id,
        });
        const approver = await upsertApprover({
          status: REPORT_STATUSES.NEEDS_ACTION,
          note: 'notes',
        }, {
          activityReportId: report.id,
          userId: mockManger.id,
        });
        expect(approver.status).toEqual(REPORT_STATUSES.NEEDS_ACTION);
        const updatedReport = await ActivityReport.findByPk(report.id);
        expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
        expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.NEEDS_ACTION);
      });
      it('updates review to "approved"', async () => {
        const report = await ActivityReport.create(multiApproverSubmittedReport);
        await ActivityReportApprover.create({
          userId: mockManger.id,
          activityReportId: report.id,
        });
        const approver = await upsertApprover({
          status: REPORT_STATUSES.APPROVED,
          note: 'notes',
        }, {
          activityReportId: report.id,
          userId: mockManger.id,
        });
        expect(approver.status).toEqual(REPORT_STATUSES.APPROVED);
        const updatedReport = await ActivityReport.findByPk(report.id);
        expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
        expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.APPROVED);
      });
      it('updates review to "approved", but knows report is awaiting review', async () => {
        const report = await ActivityReport.create(singleApproverSubmittedReport);
        await ActivityReportApprover.create({
          userId: secondMockManger.id,
          activityReportId: report.id,
        });
        const approver = await upsertApprover({
          status: REPORT_STATUSES.APPROVED,
          note: 'notes',
        }, {
          activityReportId: report.id,
          userId: secondMockManger.id,
        });
        expect(approver.status).toEqual(REPORT_STATUSES.APPROVED);
        const updatedReport = await ActivityReport.findByPk(report.id);
        expect(updatedReport.submissionStatus).toEqual(REPORT_STATUSES.SUBMITTED);
        expect(updatedReport.calculatedStatus).toEqual(REPORT_STATUSES.SUBMITTED);
      });
    });
  });
});
