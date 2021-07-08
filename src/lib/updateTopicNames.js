import { Op } from 'sequelize';
import { ActivityReport } from '../models';

const TOPIC_DICTIONARY = [
  {
    old: 'Behavioral / Mental Health',
    renamed: 'Behavioral / Mental Health / Trauma',
  },
  {
    old: 'QIP',
    renamed: 'Quality Improvement Plan/QIP',
  },
  {
    old: 'CLASS: Classroom Management',
    renamed: 'CLASS: Classroom Organization',
  },
  {
    old: 'Curriculum: Early Childhood or Parenting',
    renamed: 'Curriculum (Instructional or Parenting)',
  },
  {
    old: 'Environmental Health and Safety',
    renamed: 'Environmental Health and Safety / EPRR',
  },
];

export default async function updateTopicNames() {
  const reports = await ActivityReport.findAll({
    where: {
      topics: {
        [Op.overlap]: TOPIC_DICTIONARY.map((dict) => dict.old),
      },
    },
  });

  const promises = [];

  reports.forEach(async (report) => {
    const topics = [...report.topics];

    TOPIC_DICTIONARY.forEach((topic) => {
      const index = topics.indexOf(topic.old);

      if (index !== -1) {
        console.log(`Renaming ${topic.old} to ${topic.renamed} in ${report.id}`);
        topics.splice(index, 1, topic.renamed);
      }
    });

    promises.push(report.update({ topics }));

    console.log('TOPICS', report.topics);
  });

  return Promise.all(promises);
}
