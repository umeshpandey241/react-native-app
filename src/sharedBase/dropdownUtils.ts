export interface DropdownChangeEvent<T = unknown> {
  value: T;
  target: { name: string };
}

export interface RadioButtonChangeEvent {
  value: string;
  target: { name: string };
}

export const selectDropdownEnum = <T>(
  data: DropdownChangeEvent<T>,
  controlName: string,
  setName = false,
  model: Record<string, unknown>
): Record<string, unknown> => {
  const updatedModel = { ...model };

  updatedModel[controlName] = data.value;
  updatedModel[`${controlName}Label`] = data.value;

  if (setName) {
    updatedModel[controlName] = data.value;
  }
  return updatedModel;
};

export const selectRadioEnum = (
  e: RadioButtonChangeEvent,
  controlName: string,
  model: Record<string, unknown>,
  setModel: (updatedModel: Record<string, unknown>) => void,
  isBoolean: boolean = false
) => {
  const updatedModel = { ...model };
  updatedModel[controlName] = e.value;

  let value: boolean | string = e.value;
  if (isBoolean) {
    value = e.value === "true";
  }
  updatedModel[controlName] = value;

  if (controlName + 'Label' in updatedModel) {
    updatedModel[controlName + 'Label'] = e.value;
  }

  setModel(updatedModel);

  return value;
};

interface Model {
  [key: string]: string | number;
}

export const selectMultiData = <T extends { id?: string | number; name?: string }>(
  data: T[] | null | undefined,
  controlName: string
): Model => {
  if (!data || !Array.isArray(data)) {
    return {
      [controlName]: '',
      [`${controlName}Label`]: '',
    };
  }

  const selectedIds = data.map((i) => i.id).join(',');
  const selectedNames = data.map((i) => i.name).join(',');

  const updatedModel: Model = {};
  updatedModel[controlName] = selectedIds;
  updatedModel[`${controlName}Label`] = selectedNames;

  return updatedModel;
};
