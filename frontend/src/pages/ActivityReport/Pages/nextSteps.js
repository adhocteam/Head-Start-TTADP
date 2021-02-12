import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useFieldArray } from 'react-hook-form';
import {
  Fieldset, Label, TextInput, Button, Link,
} from '@trussworks/react-uswds';

const NoteEntry = ({
  onEntry, onCancel, humanName, isRequired = false, defaultValue = '',
}) => {
  const [input, updateInput] = useState(defaultValue);

  const onSubmit = (event) => {
    event.preventDefault();
    updateInput('');
    onEntry(input.trim());
  };

  const onEntryCancel = (event) => {
    event.preventDefault();
    onCancel();
  };

  return (
    <Fieldset className="smart-hub--report-legend smart-hub--form-section" legend={`${humanName} Next Steps`}>
      <div className="smart-hub--form-section">
        <Label htmlFor="entry">
          What have you agreed to do next?
          {' '}
          {isRequired
           && <span style={{ color: '#d42240' }}>(Required)</span>}
        </Label>

        <TextInput name="entry" value={input} onChange={(e) => updateInput(e.target.value)} />
        <Button outline disabled={!(input && input.trim())} onClick={onSubmit}>Save Next Step</Button>

        {!isRequired && <Button secondary onClick={onEntryCancel}>Cancel</Button>}
      </div>
    </Fieldset>
  );
};

const NoteEntries = ({
  control, name, humanName, register,
}) => {
  const { fields, insert, remove } = useFieldArray({ name, control, keyName: 'arrayId'});
  const [showPrompt, updateShowPrompt] = useState(false);
  // Used whenever we want a specific index to be edited
  const [noteIndex, updateNoteIndex] = useState(-1);

  /* Function to be used when updated/adding a new entry
   */
  const onEntry = (note, index, noteId) => {
    insert(index, { note, id: noteId });
    remove(index + 1);
    updateShowPrompt(false);
    updateNoteIndex(-1);
  };

  const onEdit = (index) => {
    updateNoteIndex(index);
    updateShowPrompt(true);
  };

  const onCancel = () => {
    updateShowPrompt(false);
  };

  if (fields.length === 0) {
    return (
      <NoteEntry
        onEntry={(value) => onEntry(value, 0)}
        isRequired
        onCancel={onCancel}
        humanName={humanName}
      />
    );
  }

  // Are we editing a specific index? Otherwise make insert at end of array
  const targetIndex = noteIndex === -1 ? fields.length : noteIndex;
  const targetId = fields[targetIndex]?.id;
  // Is there a value already defined at this index?
  const defaultValue = fields[targetIndex] ? fields[targetIndex].note : undefined;

  return (
    <>
      <ul style={{listStyle: 'none'}}>
        {fields.map((item, index) => (
          <li key={item.arrayId}>
            {item.note}
            <Button outline onClick={(e) => e.preventDefault() || onEdit(index)}>Edit</Button>
            <Button outline onClick={(e) => e.preventDefault() || remove(index)}>Delete</Button>
            <input name={`${name}[${index}].note`} type="hidden" value={item.note} ref={register()} disabled />
            <input name={`${name}[${index}].id`} type="hidden" value={item.id} ref={register()} disabled />
          </li>
        ))}
      </ul>

      {showPrompt ? (
        <NoteEntry
          onEntry={(value) => onEntry(value, targetIndex, targetId)}
          isRequired={false}
          onCancel={onCancel}
          humanName={humanName}
          defaultValue={defaultValue}
        />
      )
        : <Link onClick={() => updateShowPrompt(true)}>Add New Follow Up</Link>}
    </>
  );
};

const NextSteps = ({ control, register }) => (
  <>
    <Helmet>
      <title>Next steps</title>
    </Helmet>
    <NoteEntries register={register} control={control} name="specialistNotes" humanName="Specialist" />
    <NoteEntries register={register} control={control} name="granteeNotes" humanName='Grantee' />
  </>
);

NextSteps.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.object.isRequired,
};

const sections = [
  {
    title: 'Specialist next steps',
    anchor: 'specialist-next-steps',
    items: [
      { label: 'What have you agreed to do next?', name: 'stuff' },
    ],
  },
];

export default {
  position: 4,
  label: 'Next steps',
  path: 'next-steps',
  review: false,
  sections,
  render: (hookForm) => {
    const { control, register } = hookForm;
    return <NextSteps control={control} register={register} />;
  },
};
