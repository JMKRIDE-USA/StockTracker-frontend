import { createAction } from '@reduxjs/toolkit';

// ======================  PART ACTIONS ===================================
/*
 * createPart accepts payload of:
 * {name: "", type: PART_TYPE}
 */
export const createPart = createAction('CREATE_PART')
/*
 * Part actions:
 *
 * payload: partID
 */
export const toggleActivePart = createAction('TOGGLE_ACTIVE_PART');
export const deletePart = createAction('DELETE_PART');



// =================  INVENTORY ACTIONS ===================================
/*
 * {init, deposit,withdraw}Parts accept: {id: <part id>, quantity: #}
 */
export const initPart = createAction('INIT_PART');
export const depositPart = createAction('DEPOSIT_PART');
export const withdrawPart = createAction('WITHDRAW_PART');



// ================== COMPLETE SET ACTIONS ================================
/*
 * createCompleteSet accepts payload of the following:
 *
 * { a: {w1, w2, t, p, g}, b: {w1, w2, t, p, g} }
 *
 * Legend:
 *  (a | b) are the two skates
 *   - since left & right distinction doesn't matter
 *  (w1 | w2) are wheels
 *  t are trucks
 *  p are plates
 *  g is grip
 */
export const createCompleteSet = createAction('CREATE_COMPLETE_SET');
/*
 * Complete Set Actions:
 *
 * payload: completeSetID
 */
export const toggleActiveCompleteSet = createAction('DELETE_COMPLETE_SET');
export const deleteCompleteSet = createAction('DELETE_COMPLETE_SET');

