import React, { useState } from 'react';
import {
  EuiOverlayMask,
  EuiModal,
  EuiButtonEmpty,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

export const FallbackModal = ({
  onCancel,
  onConfirm,
  title,
  message,
}: {
  onCancel: (
    event?: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onConfirm: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  message: string;
}) => {
  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <EuiOverlayMask>
      <EuiModal onClose={onCancel} initialFocus="[name=input]">
        <EuiModalHeader>
          <EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiText>{message}</EuiText>
          {/* <EuiText>The action cannot be undone.</EuiText> */}
          <EuiSpacer />
        </EuiModalBody>

        <EuiModalFooter>
          {/* <EuiButtonEmpty onClick={onConfirm}>Home Page</EuiButtonEmpty> */}
          <EuiButtonEmpty onClick={onConfirm}>OK</EuiButtonEmpty>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};
