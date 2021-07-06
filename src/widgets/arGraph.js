import { Op } from 'sequelize';
import {
  ActivityReport,
} from '../models';
import { REPORT_STATUSES } from '../constants';

export const BASE_REASONS = [
  {
    reason: 'Behavioral / Mental Health / Trauma',
    count: 0,
    participants: [],
  },
  {
    reason: 'Child Assessment, Development, Screening',
    count: 0,
    participants: [],
  },
  {
    reason: 'CLASS: Classroom Management',
    count: 0,
    participants: [],
  },
  {
    reason: 'CLASS: Emotional Support',
    count: 0,
    participants: [],
  },
  {
    reason: 'CLASS: Instructional Support',
    count: 0,
    participants: [],
  },
  {
    reason: 'Coaching',
    count: 0,
    participants: [],
  },
  {
    reason: 'Communication',
    count: 0,
    participants: [],
  },
  {
    reason: 'Community and Self-Assessment',
    count: 0,
    participants: [],
  },
  {
    reason: 'Curriculum (Early Childhood or Parenting)',
    count: 0,
    participants: [],
  },
  {
    reason: 'Data and Evaluation',
    count: 0,
    participants: [],
  },
  {
    reason: 'Environmental Health and Safety',
    count: 0,
    participants: [],
  },
  {
    reason: 'Equity, Culture & Language',
    count: 0,
    participants: [],
  },
  {
    reason: 'ERSEA',
    count: 0,
    participants: [],
  },
  {
    reason: 'Facilities',
    count: 0,
    participants: [],
  },
  {
    reason: 'Family Support Services',
    count: 0,
    participants: [],
  },
  {
    reason: 'Fiscal / Budget',
    count: 0,
    participants: [],
  },
  {
    reason: 'Five-Year Grant',
    count: 0,
    participants: [],
  },
  {
    reason: 'Human Resources',
    count: 0,
    participants: [],
  },
  {
    reason: 'Leadership / Governance',
    count: 0,
    participants: [],
  },
  {
    reason: 'Learning Environments',
    count: 0,
    participants: [],
  },
  {
    reason: 'Nutrition',
    count: 0,
    participants: [],
  },
  {
    reason: 'Oral Health',
    count: 0,
    participants: [],
  },
  {
    reason: 'Parent and Family Engagement',
    count: 0,
    participants: [],
  },
  {
    reason: 'Partnerships and Community Engagement',
    count: 0,
    participants: [],
  },
  {
    reason: 'Physical Health and Screenings',
    count: 0,
    participants: [],
  },
  {
    reason: 'Pregnancy Services / Expectant Families',
    count: 0,
    participants: [],
  },
  {
    reason: 'Program Planning and Services',
    count: 0,
    participants: [],
  },
  {
    reason: 'QIP',
    count: 0,
    participants: [],
  },
  {
    reason: 'Recordkeeping and Reporting',
    count: 0,
    participants: [],
  },
  {
    reason: 'Safety Practices',
    count: 0,
    participants: [],
  },
  {
    reason: 'Teaching Practices / Teacher-Child Interactions',
    count: 0,
    participants: [],
  },
  {
    reason: 'Technology and Information Systems',
    count: 0,
    participants: [],
  },
  {
    reason: 'Transition Practices',
    count: 0,
    participants: [],
  },
  {
    reason: 'Transportation',
    count: 0,
    participants: [],
  },
];

export default async function arGraph(scopes) {
  const topicsAndParticipants = await ActivityReport.findAll({
    attributes: [
      'topics',
      'participants',
    ],
    where: {
      [Op.and]: [scopes],
      status: REPORT_STATUSES.APPROVED,

    },
    raw: true,
    includeIgnoreAttributes: false,
  });

  // new instance of base reasons so we aren't mutating the const
  const reasons = [...BASE_REASONS].map((reason) => ({
    reason: reason.reason,
    count: 0,
    participants: [],
  }));

  topicsAndParticipants.forEach((topicAndParticipant) => {
    topicAndParticipant.topics.forEach((topic) => {
      // filter our array for our 1 matching reason
      const selectedReason = reasons.find((reason) => reason.reason === topic);

      // assuming it's a reason we know what to do with
      if (selectedReason) {
        // increment the count
        selectedReason.count += 1;

        // add that reason to the participants
        selectedReason.participants = [...selectedReason.participants,
          ...topicAndParticipant.participants];

        // remove dupes from the participants
        selectedReason.participants = Array.from(new Set(selectedReason.participants));
      }
    });
  });

  return reasons;
}
