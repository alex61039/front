import { InputState } from 'react-input-mask';

const PHONE_INPUT_MASK = '+7(___) ___-____';

const getCustomerPhone = (newState: InputState, oldState: InputState, value: string) => {
  let newValue = '';

  if (newState.value === PHONE_INPUT_MASK) {
    newValue = value || '';
  } else {
    newValue = newState.value;
  }

  return {
    ...newState,
    value: newValue,
  };
};

export default getCustomerPhone;
