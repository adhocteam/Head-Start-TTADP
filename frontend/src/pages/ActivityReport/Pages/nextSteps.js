import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useFieldArray, useWatch, Controller } from 'react-hook-form';
import {
  Fieldset, Label, TextInput, Button, Link,
} from '@trussworks/react-uswds';

const NoteEntry = ({
  onEntry, onCancel, name, register, humanName, control, index, isRequired = false, defaultValue = '',
}) => {
  const fieldName = `${name}[${index}].value`
  const input = useWatch({control, name: fieldName})
  console.log(fieldName)
  return (
    <Fieldset className="smart-hub--report-legend smart-hub--form-section" legend={`${humanName} Next Steps`}>
      <div className="smart-hub--form-section">
        <Label htmlFor={fieldName}>
          What have you agreed to do next?
          {isRequired
             && <span style={{ color: '#d42240' }}>(Required)</span>}
        </Label>

        <TextInput name={fieldName} inputRef={register()} defaultValue={defaultValue} />
        <Button outline disabled={!input?.trim()} onClick={() => onEntry(input.trim())}>Save Next Step</Button>

        {!isRequired && <Button secondary onClick={() => onCancel()}>Cancel</Button>}
      </div>
    </Fieldset>
  );
};

const NoteEntries = ({ control, register, name, humanName }) => {
  const { fields, append, remove } = useFieldArray({ name, control});
  const [noteIndex, updateNoteIndex] = useState(-1);

  const onUpdateEntry = (value) => {
    console.log('on update', value)
    fields[noteIndex].value = value.trim();
    updateNoteIndex(-1);
  };

  const onNewEntry = (value) => {
    console.log('on new', value)
    append({ value: value.trim() });
    updateNoteIndex(-1);
  };

  const onCancel = () => {
    console.log('on cancel')
    updateNoteIndex(-1);
  };

  if (fields.length === 0) {
    return <NoteEntry
             index={0}
             onEntry={onNewEntry}
             isRequired={true}
             onCancel={onCancel}
             name={name}
             register={register}
             humanName={humanName}
             control={control} />;
  }

  return (
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            {item.value}
            <Button outline onClick={(e) => e.preventDefault() || updateNoteIndex(index)}>Edit</Button>
            <Button outline onClick={(e) => e.preventDefault() || remove(index)}>Delete</Button>
          </li>
        ))}
      </ul>

      {(noteIndex >= 0)
       ? (
         <NoteEntry
           index={fields.length}
           onEntry={fields[noteIndex] ? onUpdateEntry : onNewEntry}
           name={name}
           register={register}
           humanName={humanName}
           control={control}
           isRequired={false}
           onCancel={onCancel}
           defaultValue={fields[noteIndex] ? fields[noteIndex].value : undefined}
         />
       )
       : <Link onClick={() => updateNoteIndex(fields.length)}>Add New Follow Up</Link>}
      <Button outline onClick={(e) => e.preventDefault() || append({value: 'mcdonalds'})}>Append</Button>
    </>
  );
};

const NextSteps = ({ register, control }) => (
  <>
    <Helmet>
      <title>Next steps</title>
    </Helmet>
    <NoteEntries register={register} control={control} name={"specialistNotes"} humanName={'Specialist'} />
    {/* <NoteEntries register={register} control={control} name={"GranteeNotes"} humanName={'Grantee'} /> */}
  </>
);

NextSteps.propTypes = {
  register: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.object.isRequired
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
    const { register, getValues, control } = hookForm;
    return <NextSteps register={register} getValues={getValues} control={control} />;
  },
};
