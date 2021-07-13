import db, {
  ActivityReport, ActivityRecipient, User, Grantee, NonGrantee, Grant, NextStep, Region,
} from '../models';
import { filtersToScopes } from '../scopes/activityReport';
import overview from './overview';
import { REPORT_STATUSES } from '../constants';
import { createOrUpdate } from '../services/activityReports';

const GRANTEE_ID = 30;
const GRANTEE_ID_TWO = 31;

const mockUser = {
  id: 1000,
  homeRegionId: 1,
  name: 'user1000',
  hsesUsername: 'user1000',
  hsesUserId: '1000',
};

const reportObject = {
  activityRecipientType: 'grantee',
  submissionStatus: REPORT_STATUSES.SUBMITTED,
  calculatedStatus: REPORT_STATUSES.APPROVED,
  userId: mockUser.id,
  lastUpdatedById: mockUser.id,
  ECLKCResourcesUsed: ['test'],
  activityRecipients: [
    { activityRecipientId: GRANTEE_ID },
    { activityRecipientId: GRANTEE_ID_TWO },
  ],
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
};

const regionOneReport = {
  ...reportObject,
  regionId: 17,
};

const regionTwoReport = {
  ...reportObject,
  regionId: 2,
};

describe('Overview widget', () => {
  beforeAll(async () => {
    await Promise.all([
      User.create(mockUser),
      Grantee.create({ name: 'grantee', id: GRANTEE_ID }),
      Region.bulkCreate([
        { name: 'office 17', id: 17 },
        { name: 'office 18', id: 18 },
      ]),
      NonGrantee.create({ id: GRANTEE_ID, name: 'nonGrantee' }),
    ]);
    await Grant.bulkCreate([
      {
        id: GRANTEE_ID, number: '1', granteeId: GRANTEE_ID, regionId: 17, status: 'Active',
      },
      {
        id: GRANTEE_ID_TWO, number: '2', granteeId: GRANTEE_ID, regionId: 17, status: 'Active',
      },
    ]);
  });

  afterAll(async () => {
    await User.destroy({ where: { id: [mockUser.id] } });
    await Grantee.destroy({ where: { id: [GRANTEE_ID, GRANTEE_ID_TWO] } });
    await Grant.destroy({ where: { id: [GRANTEE_ID, GRANTEE_ID_TWO] } });

    // Table data is not used outside this test (e.g. not added by seeders),
    // can simply destroy all records
    await NextStep.destroy({ truncate: true });
    await ActivityRecipient.destroy({ truncate: true });
    await ActivityReport.destroy({ truncate: true });
    await NonGrantee.destroy({ truncate: true });
    await Region.destroy({ truncate: true });
    await db.sequelize.close();
  });

  it('retrieves data by region', async () => {
    const reportOne = await ActivityReport.findOne({ where: { duration: 1 } });
    await createOrUpdate(regionOneReport, reportOne);
    const reportTwo = await ActivityReport.findOne({ where: { duration: 2 } });
    await createOrUpdate({ ...regionOneReport, duration: 2 }, reportTwo);
    const reportFour = await ActivityReport.findOne({ where: { duration: 4, ttaType: ['training'] } });
    await createOrUpdate({ ...regionOneReport, duration: 4, ttaType: ['training'] }, reportFour);
    const reportFive = await ActivityReport.findOne({ where: { duration: 5, ttaType: ['training', 'technical-assistance'] } });
    await createOrUpdate({ ...regionOneReport, duration: 5, ttaType: ['training', 'technical-assistance'] }, reportFive);
    const reportOneR2 = await ActivityReport.findOne({ where: { duration: 1.5 } });
    await createOrUpdate({ ...regionTwoReport, duration: 1.5 }, reportOneR2);

    const scopes = filtersToScopes({ 'region.in': ['17'] });
    const data = await overview(scopes, 17);
    const {
      numReports,
      numGrants,
      numTotalGrants,
      numNonGrantees,
      numParticipants,
      sumDuration,
    } = data;
    expect(numReports).toBe('4');
    expect(numGrants).toBe('2');
    expect(numTotalGrants).toBe('2');
    expect(numNonGrantees).toBe('0');
    expect(numParticipants).toBe('44');
    expect(sumDuration).toBe('12.0');
  });
});
