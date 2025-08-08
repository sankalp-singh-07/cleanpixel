import { validate as uuidValidate } from 'uuid';

export const validateId = (id: string) => {
	return uuidValidate(id);
};
