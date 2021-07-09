import db, {
    ActivityReport, ActivityRecipient, User, Grantee, NonGrantee, Grant, NextStep, Region,
} from '../models';
import { filtersToScopes } from '../scopes/activityReport';
import totalHrsAndGranteeGraph from './totalHrsAndGranteeGraph';
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

const mockUserTwo = {
    id: 1002,
    homeRegionId: 1,
    name: 'user1002',
    hsesUserId: 1002,
    hsesUsername: 'Rex',
};

const mockUserThree = {
    id: 1003,
    homeRegionId: 1,
    name: 'user1003',
    hsesUserId: 1003,
    hsesUsername: 'Tex',
};

const reportObject = {
    activityRecipientType: 'grantee',
    status: REPORT_STATUSES.APPROVED,
    userId: mockUser.id,
    lastUpdatedById: mockUser.id,
    ECLKCResourcesUsed: ['test'],
    activityRecipients: [
        { activityRecipientId: GRANTEE_ID },
        { activityRecipientId: GRANTEE_ID_TWO },
    ],
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
        await User.findOrCreate({ where: mockUser });
        await Grantee.findOrCreate({ where: { name: 'grantee', id: GRANTEE_ID } });
        await Region.create({ name: 'office 17', id: 17 });
        await Region.create({ name: 'office 18', id: 18 });
        await Grant.findOrCreate({
            where: {
                id: GRANTEE_ID, number: '1', granteeId: GRANTEE_ID, regionId: 17, status: 'Active',
            },
        });
        await Grant.findOrCreate({
            where: {
                id: GRANTEE_ID_TWO, number: '2', granteeId: GRANTEE_ID, regionId: 17, status: 'Active',
            },
        });
        await NonGrantee.findOrCreate({ where: { id: GRANTEE_ID, name: 'nonGrantee' } });
    });

    afterAll(async () => {
        const reports = await ActivityReport
            .findAll({ where: { userId: [mockUser.id, mockUserTwo.id, mockUserThree.id] } });
        const ids = reports.map((report) => report.id);
        await NextStep.destroy({ where: { activityReportId: ids } });
        await ActivityRecipient.destroy({ where: { activityReportId: ids } });
        await ActivityReport.destroy({ where: { id: ids } });
        await User.destroy({ where: { id: [mockUser.id, mockUserTwo.id] } });
        await NonGrantee.destroy({ where: { id: GRANTEE_ID } });
        await Grant.destroy({ where: { id: [GRANTEE_ID, GRANTEE_ID_TWO] } });
        await Grantee.destroy({ where: { id: [GRANTEE_ID, GRANTEE_ID_TWO] } });
        await Region.destroy({ where: { id: 17 } });
        await Region.destroy({ where: { id: 18 } });
        await db.sequelize.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retrieves data by region', async () => {

        // Outside of Start Date bounds.
        const reportOne = await ActivityReport.findOne({ where: { duration: 1, startDate: '2021-01-03' } });
        await createOrUpdate({ ...regionOneReport, duration: 1, startDate: '2021-01-03'}, reportOne);

        // One Report in Feb.
        const reportTwo = await ActivityReport.findOne({ where: { duration: 2, startDate: '2021-02-15' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-02-15', duration: 2 }, reportTwo);

        // Three Reports in June.
        const reportThree = await ActivityReport.findOne({ where: { duration: 3, ttaType: ['training'], startDate: '2021-06-10' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-06-10', duration: 3, ttaType: ['training'] }, reportThree);

        const reportFour = await ActivityReport.findOne({ where: { duration: 4, ttaType: ['technical-assistance'], startDate: '2021-06-15' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-06-15', duration: 4, ttaType: ['technical-assistance'] }, reportFour);

        const reportFive = await ActivityReport.findOne({ where: { duration: 5.5, ttaType: ['training','technical-assistance'], startDate: '2021-06-20' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-06-20', duration: 5.5, ttaType: ['training','technical-assistance'] }, reportFive);

        // Two Reports in July.
        const reportSix = await ActivityReport.findOne({ where: { duration: 6, ttaType: ['training'], startDate: '2021-07-01' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-07-01', duration: 6, ttaType: ['training'] }, reportSix);

        const reportSeven = await ActivityReport.findOne({ where: { duration: 7, ttaType: ['training', 'technical-assistance'], startDate: '2021-07-09' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-07-09', duration: 7, ttaType: ['training', 'technical-assistance'] }, reportFour);

        // Outside of End Date bounds.
        const reportSeven = await ActivityReport.findOne({ where: { duration: 8, ttaType: ['training', 'technical-assistance'], startDate: '2021-08-08' } });
        await createOrUpdate({ ...regionOneReport, startDate: '2021-08-08', duration: 8, ttaType: ['training', 'technical-assistance'] }, reportSeven);

        // Different Region.
        const reportOneR2 = await ActivityReport.findOne({ where: { duration: 1.5 } });
        await createOrUpdate({ ...regionTwoReport, duration: 1.5 }, reportOneR2);

        const query = { 'region.in': ['17'], 'startDate.win': '2021/02/01-2021/07/31'};
        const scopes = filtersToScopes(query);
        const data = await totalHrsAndGranteeGraph(scopes, query);

        // Overall trace categories.
        expect(data.length).toEqual(4);

        // Grantee Rec TTA.
        expect(data[0].x.length).toEqual(3);
        expect(data[0].y.length).toEqual(3);

        expect(data[0].x).toStrictEqual([2,6,4]);
        expect(data[0].y).toEqual(['February', 'June', 'July']);

        // Hours of Training.
        expect(data[1].x.length).toEqual(3);
        expect(data[1].y.length).toEqual(3);

        expect(data[1].x).toStrictEqual([0,3,6]);
        expect(data[1].y).toEqual(['February', 'June', 'July']);

        // Hours of Technical Assistance.
        expect(data[2].x.length).toEqual(3);
        expect(data[2].y.length).toEqual(3);

        expect(data[2].x).toStrictEqual([2,4,0]);
        expect(data[2].y).toEqual(['February', 'June', 'July']);

        // Both.
        expect(data[3].x.length).toEqual(3);
        expect(data[3].y.length).toEqual(3);

        expect(data[3].x).toStrictEqual([0,0,7]);
        expect(data[3].y).toEqual(['February', 'June', 'July']);
    });
});
