import { createTransport } from 'nodemailer';
import Email from 'email-templates';
import * as path from 'path';
import { auditLogger, logger } from '../../logger';
import newQueue from '../queue';

export const notificationQueue = newQueue('notifications');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  NODE_ENV,
  SEND_NON_PRODUCTION_NOTIFICATIONS,
} = process.env;

// nodemailer expects this value as a boolean.
const secure = SMTP_SECURE !== 'false';

const defaultTransport = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const send = NODE_ENV === 'production' || SEND_NON_PRODUCTION_NOTIFICATIONS === 'true';

const emailTemplatePath = path.join(process.cwd(), 'src', 'email_templates');

//
// Process functions: in the worker these functions are assigned to run every time a
// specific named job is added to the notification queue
//

export const notifyUserChangesRequested = (job, transport = defaultTransport) => {
  const { report, approver } = job.data;
  // Set these inside the function to allow easier testing
  const { FROM_EMAIL_ADDRESS, SEND_NOTIFICATIONS } = process.env;
  if (SEND_NOTIFICATIONS === 'true') {
    const {
      id,
      author,
      displayId,
      collaborators,
    } = report;
    const approverEmail = approver.user.email
    const approverName = approver.user.name
    const approverNote = approver.note
    logger.info(`MAILER: ${approverName} requested changes on report ${displayId}`);
    const collabArray = collaborators.map((c) => c.email);
    const reportPath = path.join(process.env.TTA_SMART_HUB_URI, 'activity-reports', String(id));
    const email = new Email({
      message: {
        from: FROM_EMAIL_ADDRESS,
      },
      send,
      transport,
      htmlToText: {
        wordwrap: 120,
      },
    });
    return email.send({
      template: path.resolve(emailTemplatePath, 'changes_requested_by_manager'),
      message: {
        to: [author.email, ...collabArray],
      },
      locals: {
        managerName: approverName,
        reportPath,
        displayId,
        comments: approverNoteß,
      },
    });
  }
  // return a promise so that returns are consistent
  return Promise.resolve(null);
};

export const reportApproved = (job, transport = defaultTransport) => {
  const { report } = job.data;
  // Set these inside the function to allow easier testing
  const { FROM_EMAIL_ADDRESS, SEND_NOTIFICATIONS } = process.env;
  if (SEND_NOTIFICATIONS === 'true') {
    logger.info(`MAILER: All managers approved report ${report.displayId}}`);
    const {
      id,
      author,
      displayId,
      approvingManager,
      collaborators,
    } = report;
    const collaboratorEmailAddresses = collaborators.map((c) => c.email);
    const reportPath = path.join(process.env.TTA_SMART_HUB_URI, 'activity-reports', String(id));
    const email = new Email({
      message: {
        from: FROM_EMAIL_ADDRESS,
      },
      send,
      transport,
      htmlToText: {
        wordwrap: 120,
      },
    });
    return email.send({
      template: path.resolve(emailTemplatePath, 'report_approved'),
      message: {
        to: [author.email, ...collaboratorEmailAddresses],
      },
      locals: {
        reportPath,
        displayId,
      },
    });
  }
  return Promise.resolve(null);
};

export const notifyApprover = (job, transport = defaultTransport) => {
// Set these inside the function to allow easier testing
  const { report, approver } = job.data;
  const { FROM_EMAIL_ADDRESS, SEND_NOTIFICATIONS } = process.env;
  if (SEND_NOTIFICATIONS === 'true') {
    const {
      id,
      author,
      displayId,
    } = report;
    const approverEmail = approver.user.email
    logger.info(`MAILER: Notifying ${approverEmail} that they were requested to approve report ${displayId}`);
    const reportPath = path.join(process.env.TTA_SMART_HUB_URI, 'activity-reports', String(id));
    const email = new Email({
      message: {
        from: FROM_EMAIL_ADDRESS,
      },
      send,
      transport,
      htmlToText: {
        wordwrap: 120,
      },
    });
    return email.send({
      template: path.resolve(emailTemplatePath, 'manager_approval_requested'),
      message: {
        to: [approverEmail],
      },
      locals: {
        author: author.name,
        reportPath,
        displayId,
      },
    });
  }
  return Promise.resolve(null);
};

export const notifyCollaborator = (job, transport = defaultTransport) => {
  const { report, newCollaborator } = job.data;
  // Set these inside the function to allow easier testing
  const { FROM_EMAIL_ADDRESS, SEND_NOTIFICATIONS } = process.env;
  if (SEND_NOTIFICATIONS === 'true') {
    logger.info(`MAILER: Notifying ${newCollaborator.email} that they were added as a collaborator to report ${report.displayId}`);
    const {
      id,
      displayId,
    } = report;
    const reportPath = path.join(process.env.TTA_SMART_HUB_URI, 'activity-reports', String(id));
    const email = new Email({
      message: {
        from: FROM_EMAIL_ADDRESS,
      },
      send,
      transport,
      htmlToText: {
        wordwrap: 120,
      },
    });
    return email.send({
      template: path.resolve(emailTemplatePath, 'collaborator_added'),
      message: {
        to: [newCollaborator.email],
      },
      locals: {
        reportPath,
        displayId,
      },
    });
  }
  return Promise.resolve(null);
};

//
// Job producers: add named jobs to notification queue
//

export const collaboratorAddedNotification = (report, newCollaborators) => {
  newCollaborators.forEach((collaborator) => {
    try {
      const data = {
        report,
        newCollaborator: collaborator,
      };
      notificationQueue.add('collaboratorAdded', data);
    } catch (err) {
      auditLogger.error(err);
    }
  });
};

/**
 * Add 'approverAssigned' job to notification queue with data
 *
 * @param {*} data - object with properties report and approver
 */
export const approverAssignedNotification = (data) => {
  try {
    // data was data.report
    if (data.hasOwnProperty('report') || data.hasOwnProperty('approver'))
      throw('Notification job data is missing report or approver properties')
    // job name was 'managerApproval'
    notificationQueue.add('approverAssigned', data);
  } catch (err) {
    auditLogger.error(err);
  }
};

export const reportApprovedNotification = (report) => {
  try {
    const data = {
      report,
    };
    notificationQueue.add('reportApproved', data);
  } catch (err) {
    auditLogger.error(err);
  }
};

export const changesRequestedNotification = (report) => {
  try {
    if (data.hasOwnProperty('report') || data.hasOwnProperty('approver'))
      throw('Notification job data is missing report or approver properties')
    notificationQueue.add('changesRequested', data);
  } catch (err) {
    auditLogger.error(err);
  }
};

export default defaultTransport;
