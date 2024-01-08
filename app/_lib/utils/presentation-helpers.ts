
// present ISO-8601 with offset as `${curDate.getFullYear()}.${curDate.getMonth()}.${curDate.getDay()}`
export function presentDate(dateString: string) {
    let date = new Date(Date.parse(dateString));
    let formattedString = date.toLocaleString();
    return formattedString;
}