export interface SubmissionResult {
  success: boolean;
  message: string;
}

/**
 * Libellés repris à l'identique de `public/js/scripts.js` (`submitMSG`) afin de
 * ne pas modifier le comportement visible du template d'origine.
 */
export const SUBMISSION_SUCCESS: SubmissionResult = {
  success: true,
  message: 'Form submitted successfully',
};

export const SUBMISSION_ERROR: SubmissionResult = {
  success: false,
  message: 'Found error in the form. Please check again.',
};