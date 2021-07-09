import transitionToMultApprovers from './transitionToMultApprovers';
import db, {
  ActivityReport,
  ActivityReportApprover,
  User,
} from '../models';
import { REPORT_STATUSES } from '../constants';

const author = {
  id: 1000,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const manager = {
  id: 2000,
  homeRegionId: 2,
  name: 'user2000',
  hsesUsername: 'user2000',
  hsesUserId: '2000',
};

const report = {
  userId: author.id,
  regionId: 1,
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

const deletedReport = {
  ...report,
  submissionStatus: REPORT_STATUSES.DELETED,
};

const draftReport = {
  ...report,
  submissionStatus: REPORT_STATUSES.DRAFT,
};

const submittedReport = {
  ...report,
  oldApprovingManagerId: manager.id,
  submissionStatus: REPORT_STATUSES.SUBMITTED,
};

const needsActionReport = {
  ...report,
  oldApprovingManagerId: manager.id,
  oldManagerNotes: 'make changes',
  submissionStatus: REPORT_STATUSES.NEEDS_ACTION,
};

const approvedReport = {
  ...report,
  oldApprovingManagerId: manager.id,
  oldManagerNotes: 'great work',
  submissionStatus: REPORT_STATUSES.APPROVED,
};

describe('Transition to multiple approvers', () => {
  beforeAll(async () => {
    await User.create(author);
    await User.create(manager);

    await ActivityReport.bulkCreate([
      deletedReport, draftReport, submittedReport, needsActionReport, approvedReport,
    ]);

    await transitionToMultApprovers();
  });

  afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true})
    await db.sequelize.close();
  });

  it('updated the calculatedStatus of draft and deleted reports', async () => {
    const draft = await ActivityReport.findAll({
      where: { submissionStatus: REPORT_STATUSES.DRAFT },
    });
    expect(draft.length).toBe(1);
    expect(draft[0].calculatedStatus).toEqual(REPORT_STATUSES.DRAFT);
    const deleted = await ActivityReport.findAll({
      where: { submissionStatus: REPORT_STATUSES.DELETED },
    });
    expect(deleted.length).toBe(1);
    expect(deleted[0].calculatedStatus).toEqual(REPORT_STATUSES.DELETED);
  });

  it('created submitted approver', async () => {
    const reports = await ActivityReport.findAll({
      where: { calculatedStatus: REPORT_STATUSES.SUBMITTED },
    });
    expect(reports.length).toBe(1);
    const approvers = await ActivityReportApprover.findAll({
      where: { activityReportId: reports[0].id },
    });
    expect(approvers.length).toBe(1);
    expect(approvers[0].note).toBeNull();
    expect(approvers[0].status).toBeNull();
  });

  it('created needs_action approver', async () => {
    const reports = await ActivityReport.findAll({
      where: { calculatedStatus: REPORT_STATUSES.NEEDS_ACTION },
    });
    expect(reports.length).toBe(1);
    const approvers = await ActivityReportApprover.findAll({
      where: { activityReportId: reports[0].id },
    });
    expect(approvers.length).toBe(1);
    expect(approvers[0].note).toEqual(needsActionReport.oldManagerNotes);
    expect(approvers[0].status).toEqual(needsActionReport.submissionStatus);
  });

  it('created approved approver', async () => {
    const reports = await ActivityReport.findAll({
      where: { calculatedStatus: REPORT_STATUSES.APPROVED },
    });
    expect(reports.length).toBe(1);
    const approvers = await ActivityReportApprover.findAll({
      where: { activityReportId: reports[0].id },
    });
    expect(approvers.length).toBe(1);
    expect(approvers[0].note).toEqual(approvedReport.oldManagerNotes);
    expect(approvers[0].status).toEqual(approvedReport.submissionStatus);
  });
});
