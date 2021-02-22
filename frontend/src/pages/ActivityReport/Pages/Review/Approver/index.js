import React from 'react';
import PropTypes from 'prop-types';

import Review from './Review';
import Approved from './Approved';
import { REPORT_STATUSES } from '../../../../../Constants';

const Approver = ({
  onFormReview,
  reviewed,
  formData,
}) => {
  const { managerNotes, additionalNotes, status } = formData;
  const review = status === REPORT_STATUSES.SUBMITTED || status === REPORT_STATUSES.NEEDS_ACTION;
  const approved = status === REPORT_STATUSES.APPROVED;

  return (
    <>
      {review
      && (
      <Review
        reviewed={reviewed}
        additionalNotes={additionalNotes}
        onFormReview={onFormReview}
      />
      )}
      {approved
      && (
      <Approved
        additionalNotes={additionalNotes}
        managerNotes={managerNotes}
      />
      )}
    </>
  );
};

Approver.propTypes = {
  onFormReview: PropTypes.func.isRequired,
  reviewed: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    approvingManager: PropTypes.shape({
      name: PropTypes.string,
    }),
    managerNotes: PropTypes.string,
    additionalNotes: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default Approver;
