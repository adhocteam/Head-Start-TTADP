const now = new Date();

const bulletedGoal = `
  * Staff have become very Tech Savvy
  * Grantee utilized down time to promote individual Professional Development and began training on Conscious Discipline to support staff and families with challenges.
  * Created program changes to support COVID times such as:
        Swivel cameras for observations
        DOJO communication device for parents
        Weekly ZOOM connects to support staff.
`;

const longGoal = `Grantee will receive support in developing a full enrollment action plan that covers the 12-month under-enrollment period.
Grantee will receive strategies for ensuring they can consistently meet enrollment requirement via their ERSEA policies and procedures. Grantee will receive strategies for ensuring their partnership with Skyline leads to sustainable enrollment.`;

const goals = [
  {
    id: 100,
    name: 'Identify strategies to support Professional Development with an emphasis on Staff Wellness and Social Emotional Development.',
    status: 'Not Started',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 101,
    name: 'Grantee supports and sustains comprehensive, integrated and systemic SR, PFCE, and PD processes and services.',
    status: 'Not Started',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 102,
    name: bulletedGoal,
    status: 'Not Started',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 103,
    name: longGoal,
    status: 'Not Started',
    createdAt: now,
    updatedAt: now,
  },
];

const grantGoals = [
  {
    id: 100,
    grantId: 1,
    goalId: 100,
    granteeId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 101,
    grantId: 1,
    goalId: 101,
    granteeId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 102,
    grantId: 1,
    goalId: 102,
    granteeId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 103,
    grantId: 2,
    goalId: 103,
    granteeId: 2,
    createdAt: now,
    updatedAt: now,
  },
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert('Goals', goals, { transaction });
      await queryInterface.bulkInsert('GrantGoals', grantGoals, { transaction });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete('Goals', null, { transaction });
      await queryInterface.bulkDelete('GrantGoals', null, { transaction });
    });
  },
};
