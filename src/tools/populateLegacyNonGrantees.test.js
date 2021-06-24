import { Op } from 'sequelize';
import {
  ActivityReport, ActivityRecipient, User, sequelize,
} from '../models';
import { auditLogger } from '../logger';
import populateLegacyNonGrantees from './populateLegacyNonGrantees';
import { REPORT_STATUSES } from '../constants';
import { createOrUpdate } from '../services/activityReports';

jest.mock('../logger');

const mockUser = {
  id: 1000,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const reportObject = {
  activityRecipientType: 'non-grantee',
  status: REPORT_STATUSES.APPROVED,
  userId: mockUser.id,
  lastUpdatedById: mockUser.id,
  ECLKCResourcesUsed: ['test'],
  approvingManagerId: 1,
  numberOfParticipants: 11,
  deliveryMethod: 'method',
  duration: 1,
  endDate: '2000-01-01T12:00:00Z',
  startDate: '2000-01-01T12:00:00Z',
  requester: 'requester',
  programTypes: ['type'],
  targetPopulations: ['pop'],
  reason: ['reason'],
  participants: ['participants'],
  topics: ['topics'],
  ttaType: ['technical-assistance'],
  imported: {
    nonGranteeActivity:
      'CCDF / Child Care Administrator\nHSCO\nState Advisory Council\nState Head Start Association\nState Professional Development / Continuing Education',
  },
};

const regionOneReport = {
  ...reportObject,
  regionId: 1,
};

describe('populateLegacyNonGrantees', () => {
  beforeAll(async () => {
    await ActivityRecipient.destroy({
      where: {
        nonGranteeId: { [Op.ne]: null },
      },
    });
    await ActivityReport.destroy({
      where: {
        activityRecipientType: 'non-grantee',
        legacyId: { [Op.ne]: null },
      },
    });
    await User.findOrCreate({ where: mockUser });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('connects non-grantees to activity reports', async () => {
    const reportOne = await ActivityReport.findOne({ where: { duration: 1 } });
    await createOrUpdate(regionOneReport, reportOne);
    const activityRecipientBefore = await ActivityRecipient.findOne({
      where: { activityReportId: reportOne.id },
    });
    expect(activityRecipientBefore).toBeNull();
    await populateLegacyNonGrantees();
    const activityRecipientsAfter = await ActivityRecipient.findAll({
      where: { activityReportId: reportOne.id },
    });
    expect(activityRecipientsAfter.length).toBe(5);
    expect(activityRecipientsAfter[2].nonGranteeId).toBe(3);
  });
  it('is idempotent', async () => {
    const recipients = await ActivityRecipient.findAll();
    await populateLegacyNonGrantees();
    expect((await ActivityRecipient.findAll()).length).toBe(recipients.length);
    await populateLegacyNonGrantees();
    expect((await ActivityRecipient.findAll()).length).toBe(recipients.length);
  });

  it('should log to the auditLogger', async () => {
    await populateLegacyNonGrantees();
    expect(auditLogger.info).toHaveBeenCalled();
  });
});
