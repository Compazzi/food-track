/** Reference date for “today” in demos (matches mock meal logs). */
/** 
 * It does not make sense to have a constant for today, because it will change depending on the timezone.
 * Must be modified in future.
 */
const now = new Date();
const offset = now.getTimezoneOffset() * 60000;
const localISODate = (new Date(now.getTime() - offset)).toISOString().split('T')[0];

export const TODAY = localISODate;